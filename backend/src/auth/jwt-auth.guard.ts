import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new UnauthorizedException('Falta el token de acceso')
    }

    try {
      request.user = await this.jwt.verifyAsync(token)
    } catch {
      throw new UnauthorizedException('Token inválido o expirado')
    }

    return true
  }
}
