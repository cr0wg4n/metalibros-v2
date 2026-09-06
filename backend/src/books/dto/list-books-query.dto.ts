import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { BookStatus } from '../../generated/prisma/client.js'

export class ListBooksQueryDto {
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20
}
