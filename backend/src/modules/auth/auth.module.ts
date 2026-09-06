import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard.js'
import { env } from '../../config/env.js'
import { ProfileModule } from '../profile/profile.module.js'

const jwtModule = JwtModule.register({
  secret: env.jwtSecret,
  signOptions: { expiresIn: '15m' },
})

@Module({
  imports: [jwtModule, ProfileModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard, jwtModule],
})
export class AuthModule {}
