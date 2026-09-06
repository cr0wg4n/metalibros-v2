import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService, REFRESH_TOKEN_TTL_MS } from './auth.service.js'
import { SignUpDto } from './dto/sign-up.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { PrismaService } from '../prisma/prisma.service.js'
import { env } from '../config/env.js'

const REFRESH_COOKIE_NAME = 'refreshToken'
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax' as const,
  path: '/auth',
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
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
  async me(@Req() request: Request) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: request.user!.sub } })
    return { id: user.id, email: user.email, name: user.name }
  }

  private setRefreshCookie(response: Response, token: string) {
    response.cookie(REFRESH_COOKIE_NAME, token, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_TTL_MS,
    })
  }
}
