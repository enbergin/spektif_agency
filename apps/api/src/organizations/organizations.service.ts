import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, InviteUserDto } from './dto/organizations.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findUserOrganizations(userId: string) {
    const orgMembers = await this.prisma.orgMember.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            _count: {
              select: {
                members: true,
                boards: true,
              },
            },
          },
        },
      },
    });

    return orgMembers.map((member) => ({
      id: member.organization.id,
      name: member.organization.name,
      role: member.role,
      memberCount: member.organization._count.members,
      boardCount: member.organization._count.boards,
      // subscriptionStatus: member.organization.subscriptionStatus, // Field doesn't exist in current schema
    }));
  }

  async findOne(id: string, userId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                // avatar: true // Use name only for now,
              },
            },
          },
        },
        boards: {
          include: {
            _count: {
              select: { lists: true },
            },
          },
        },
        subscriptions: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user is member
    const isMember = organization.members?.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Not a member of this organization');
    }

    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto, userId: string) {
    // Check if user is admin
    const member = await this.prisma.orgMember.findUnique({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: id,
          userId,
        },
      },
    });

    if (!member || member.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update organization');
    }

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async inviteUser(organizationId: string, dto: InviteUserDto, inviterId: string) {
    // Check if inviter is admin
    const inviter = await this.prisma.orgMember.findUnique({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId: inviterId,
        },
      },
    });

    if (!inviter || inviter.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can invite users');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Create user account (they'll need to set password later)
      user = await this.prisma.user.create({
        data: {
          name: dto.name || dto.email.split('@')[0],
          email: dto.email,
        },
      });
    }

    // Check if already member
    const existingMember = await this.prisma.orgMember.findUnique({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new ForbiddenException('User is already a member');
    }

    // Add to organization
    await this.prisma.orgMember.create({
      data: {
        orgId: organizationId,
        userId: user.id,
        role: (dto.role as any) || 'EMPLOYEE',
      },
    });

    // TODO: Send invitation email

    return { message: 'User invited successfully' };
  }

  async removeUser(organizationId: string, userId: string, adminId: string) {
    // Check if admin
    const admin = await this.prisma.orgMember.findUnique({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId: adminId,
        },
      },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can remove users');
    }

    // Can't remove yourself if you're the only admin
    if (userId === adminId) {
      const adminCount = await this.prisma.orgMember.count({
        where: {
          orgId: organizationId,
          role: 'ADMIN',
        },
      });

      if (adminCount === 1) {
        throw new ForbiddenException('Cannot remove the last admin');
      }
    }

    await this.prisma.orgMember.delete({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId,
        },
      },
    });

    return { message: 'User removed successfully' };
  }

  async updateUserRole(organizationId: string, userId: string, role: string, adminId: string) {
    // Check if admin
    const admin = await this.prisma.orgMember.findUnique({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId: adminId,
        },
      },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update user roles');
    }

    return this.prisma.orgMember.update({
      where: {
        /* userId_orgId */ organizationId_userId: {
          orgId: organizationId,
          userId,
        },
      },
      data: { role: role as any },
    });
  }
}
