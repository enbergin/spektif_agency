import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto, CreateConversationDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(dto: CreateConversationDto, userId: string) {
    // Check if user has access to the organization
    const orgMember = await this.prisma.orgMember.findUnique({
      where: {
        userId_organizationId: {
          organizationId: dto.organizationId,
          userId,
        },
      },
    });

    if (!orgMember) {
      throw new ForbiddenException('Not a member of this organization');
    }

    // For DM conversations, check if conversation already exists
    if (dto.type === 'DM' && dto.participantIds.length === 1) {
      const existingConversation = await this.prisma.conversation.findFirst({
        where: {
          organizationId: dto.organizationId,
          type: 'DM',
          participants: {
            every: {
              userId: { in: [userId, dto.participantIds[0]] },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (existingConversation) {
        return existingConversation;
      }
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        organizationId: dto.organizationId,
        type: dto.type,
        name: dto.title,
        // cardId: dto.cardId, // Field doesn't exist in current schema
        participants: {
          create: [
            { userId, role: 'admin' },
            ...dto.participantIds.map(participantId => ({
              userId: participantId,
              role: 'member',
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return conversation;
  }

  async getConversations(organizationId: string, userId: string) {
    // Check if user is member of organization
    const orgMember = await this.prisma.orgMember.findUnique({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    });

    if (!orgMember) {
      throw new ForbiddenException('Not a member of this organization');
    }

    return this.prisma.conversation.findMany({
      where: {
        organizationId,
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    // Check if user is participant
    const participant = await this.prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    const skip = (page - 1) * limit;

    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        // replyTo: // Field doesn't exist in current schema
        // {
        //   include: {
        //     sender: {
        //       select: {
        //         id: true,
        //         name: true,
        //       },
        //     },
        //   },
        // },
        // attachments: true, // Field doesn't exist in current schema
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
  }

  async createMessage(dto: CreateMessageDto) {
    // Check if user is participant
    const participant = await this.prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          conversationId: dto.conversationId,
          userId: dto.authorId,
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    // If replying to a message, verify it exists in the same conversation
    if (dto.replyToId) {
      const replyToMessage = await this.prisma.message.findUnique({
        where: { id: dto.replyToId },
      });

      if (!replyToMessage || replyToMessage.conversationId !== dto.conversationId) {
        throw new NotFoundException('Reply target message not found');
      }
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: dto.authorId,
        content: dto.text,
        // replyToId: dto.replyToId, // Field doesn't exist in current schema
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        // replyTo: // Field doesn't exist in current schema
        // {
        //   include: {
        //     sender: {
        //       select: {
        //         id: true,
        //         name: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markMessageAsRead(messageId: string, userId: string) {
    // Check if message exists and user is participant
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!message || message.conversation.participants.length === 0) {
      throw new ForbiddenException('Cannot mark message as read');
    }

    // TODO: Implement read receipts table if needed
    // For now, we'll just emit the event via WebSocket
    return { success: true };
  }

  async addParticipant(conversationId: string, userId: string, requesterId: string) {
    // Check if requester is admin of the conversation
    const requesterParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId: requesterId,
        },
      },
    });

    if (!requesterParticipant || requesterParticipant.role !== 'admin') {
      throw new ForbiddenException('Only conversation admins can add participants');
    }

    // Check if user is already a participant
    const existingParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId,
        },
      },
    });

    if (existingParticipant) {
      throw new ForbiddenException('User is already a participant');
    }

    return this.prisma.participant.create({
      data: {
        conversationId,
        userId,
        role: 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async removeParticipant(conversationId: string, userId: string, requesterId: string) {
    // Check if requester is admin or removing themselves
    const requesterParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          conversationId,
          userId: requesterId,
        },
      },
    });

    if (!requesterParticipant || (requesterParticipant.role !== 'admin' && requesterId !== userId)) {
      throw new ForbiddenException('Cannot remove participant');
    }

    await this.prisma.participant.delete({
      where: {
        userId_conversationId: {
          conversationId,
          userId,
        },
      },
    });

    return { success: true };
  }
}
