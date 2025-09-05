import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user and organization
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Create organization for the user
    const organization = await this.prisma.organization.create({
      data: {
        name: dto.organizationName,
        slug: dto.organizationName.toLowerCase().replace(/\s+/g, '-'),
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        },
      },
    });

    const token = this.jwtService.sign({ userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        orgMembers: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organizations: user.orgMembers.map((member) => ({
        id: member.organization.id,
        name: member.organization.name,
        role: member.role,
      })),
      token,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orgMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  async googleLogin(googleUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      // User exists, login
      const token = this.jwtService.sign({ userId: user.id });
      return { user, token };
    }

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      },
    });

    const token = this.jwtService.sign({ userId: newUser.id });
    return { user: newUser, token };
  }
}
