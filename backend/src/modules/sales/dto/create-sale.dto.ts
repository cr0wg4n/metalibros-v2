import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSaleDto {
  @IsString()
  bookId: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsNumber()
  @Min(0)
  revenue: number;

  @IsOptional()
  @IsISO8601()
  soldAt?: string;
}
