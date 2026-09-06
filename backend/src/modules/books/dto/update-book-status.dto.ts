import { IsEnum } from 'class-validator';
import { BookStatus } from '../../../generated/prisma/client.js';

export class UpdateBookStatusDto {
  @IsEnum(BookStatus)
  status: BookStatus;
}
