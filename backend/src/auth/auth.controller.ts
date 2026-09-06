import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService, REFRESH_TOKEN_TTL_MS } from './auth.service.js'
import { SignUpDto } from './dto/sign-up.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { env } from '../config/env.js'
import { ProfileService } from '../profile/profile.service.js'
import { UpdateProfileDto } from '../profile/dto/update-profile.dto.js'
import { createImageUploadInterceptor } from '../common/create-image-upload-interceptor.js'

const REFRESH_COOKIE_NAME = 'refreshToken'
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax' as const,
  path: '/auth',
}

const avatarUploadInterceptor = createImageUploadInterceptor('avatars')

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...body } = await this.authService.signUp(dto)
    this.setRefreshCookie(response, refreshToken)
    return body
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...body } = await this.authService.login(dto)
    this.setRefreshCookie(response, refreshToken)
    return body
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const currentToken = request.cookies?.[REFRESH_COOKIE_NAME]
    if (!currentToken) {
      throw new UnauthorizedException('Falta el refresh token')
    }

    const { refreshToken, ...body } = await this.authService.refresh(currentToken)
    this.setRefreshCookie(response, refreshToken)
    return body
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const currentToken = request.cookies?.[REFRESH_COOKIE_NAME]
    if (currentToken) {
      await this.authService.logout(currentToken)
    }
    response.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request) {
    return this.profileService.getProfile(request.user!.sub)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() request: Request, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(request.user!.sub, dto)
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(avatarUploadInterceptor)
  uploadAvatar(@Req() request: Request, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Falta el archivo de imagen')
    }
    return this.profileService.updateAvatar(request.user!.sub, `/uploads/avatars/${file.filename}`)
  }

  private setRefreshCookie(response: Response, token: string) {
    response.cookie(REFRESH_COOKIE_NAME, token, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_TTL_MS,
    })
  }
}
