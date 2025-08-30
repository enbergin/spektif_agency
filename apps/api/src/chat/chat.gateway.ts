import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://0.0.0.0:3000'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, AuthenticatedSocket>();

  constructor(private chatService: ChatService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // TODO: Implement JWT token validation from socket handshake
      // For now, we'll use mock authentication
      const userId = client.handshake.query.userId as string;
      const userName = client.handshake.query.userName as string;

      if (!userId) {
        client.disconnect();
        return;
      }

      client.user = {
        id: userId,
        name: userName || 'Unknown User',
        email: `${userId}@example.com`,
      };

      this.connectedUsers.set(userId, client);

      // Join user to their personal room
      await client.join(`user:${userId}`);

      // Notify other users that this user is online
      client.broadcast.emit('user:online', {
        userId,
        userName: client.user.name,
      });

      console.log(`User ${userId} connected to chat`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      this.connectedUsers.delete(client.user.id);

      // Notify other users that this user is offline
      client.broadcast.emit('user:offline', {
        userId: client.user.id,
      });

      console.log(`User ${client.user.id} disconnected from chat`);
    }
  }

  @SubscribeMessage('join:conversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    await client.join(`conversation:${data.conversationId}`);

    // Notify others in the conversation
    client.to(`conversation:${data.conversationId}`).emit('user:joined-conversation', {
      userId: client.user.id,
      userName: client.user.name,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('leave:conversation')
  async handleLeaveConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    await client.leave(`conversation:${data.conversationId}`);

    // Notify others in the conversation
    client.to(`conversation:${data.conversationId}`).emit('user:left-conversation', {
      userId: client.user.id,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('send:message')
  async handleSendMessage(
    @MessageBody() data: {
      conversationId: string;
      text: string;
      replyToId?: string;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    try {
      const message = await this.chatService.createMessage({
        conversationId: data.conversationId,
        authorId: client.user.id,
        text: data.text,
        replyToId: data.replyToId,
      });

      // Emit message to all users in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('message:received', {
        id: message.id,
        conversationId: data.conversationId,
        text: data.text,
        authorId: client.user.id,
        authorName: client.user.name,
        replyToId: data.replyToId,
        createdAt: new Date().toISOString(),
      });

      // TODO: Send push notifications to offline users

    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    client.to(`conversation:${data.conversationId}`).emit('typing:user-started', {
      userId: client.user.id,
      userName: client.user.name,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    client.to(`conversation:${data.conversationId}`).emit('typing:user-stopped', {
      userId: client.user.id,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @MessageBody() data: { messageId: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    try {
      await this.chatService.markMessageAsRead(data.messageId, client.user.id);

      // Notify others in the conversation about read receipt
      client.to(`conversation:${data.conversationId}`).emit('message:read-receipt', {
        messageId: data.messageId,
        userId: client.user.id,
        userName: client.user.name,
        readAt: new Date().toISOString(),
      });
    } catch (error) {
      client.emit('error', { message: 'Failed to mark message as read' });
    }
  }

  // Board-related real-time events
  @SubscribeMessage('join:board')
  async handleJoinBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    await client.join(`board:${data.boardId}`);
  }

  @SubscribeMessage('leave:board')
  async handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    await client.leave(`board:${data.boardId}`);
  }

  @SubscribeMessage('card:moved')
  async handleCardMoved(
    @MessageBody() data: {
      cardId: string;
      fromListId: string;
      toListId: string;
      newOrder: number;
      boardId: string;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    // Broadcast card movement to all users viewing the board
    client.to(`board:${data.boardId}`).emit('card:moved', {
      ...data,
      movedBy: client.user.id,
      movedAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('card:updated')
  async handleCardUpdated(
    @MessageBody() data: {
      cardId: string;
      boardId: string;
      changes: any;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    // Broadcast card updates to all users viewing the board
    client.to(`board:${data.boardId}`).emit('card:updated', {
      ...data,
      updatedBy: client.user.id,
      updatedAt: new Date().toISOString(),
    });
  }

  // Calendar real-time events
  @SubscribeMessage('calendar:event-updated')
  async handleCalendarEventUpdated(
    @MessageBody() data: {
      eventId: string;
      organizationId: string;
      changes: any;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) return;

    // Broadcast calendar updates to organization members
    client.to(`org:${data.organizationId}`).emit('calendar:event-updated', {
      ...data,
      updatedBy: client.user.id,
      updatedAt: new Date().toISOString(),
    });
  }

  // Utility method to get online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Utility method to send notification to specific user
  async sendNotificationToUser(userId: string, notification: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('notification', notification);
    }
  }
}
