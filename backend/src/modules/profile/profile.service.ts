import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { User, Profile } from '../../generated/prisma/client.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';

type UserWithProfile = User & { profile: Profile | null };

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toProfileView(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Ya existe una cuenta con este correo');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        profile: {
          upsert: {
            create: { about: dto.about, phone: dto.phone },
            update: {
              ...(dto.about !== undefined ? { about: dto.about } : {}),
              ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
            },
          },
        },
      },
      include: { profile: true },
    });

    return this.toProfileView(user);
  }

  async updateAvatar(userId: string, avatar: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: { avatar },
            update: { avatar },
          },
        },
      },
      include: { profile: true },
    });

    return this.toProfileView(user);
  }

  private toProfileView(user: UserWithProfile) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      about: user.profile?.about ?? null,
      avatar: user.profile?.avatar ?? null,
      phone: user.profile?.phone ?? null,
    };
  }
}
