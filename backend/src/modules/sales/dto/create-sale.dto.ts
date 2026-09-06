import { IsNumber, IsString, Min, MinLength } from 'class-validator'

export class CreateSaleDto {
  @IsString()
  bookId: string

  @IsString()
  @MinLength(1)
  city: string

  @IsNumber()
  @Min(0)
  revenue: number
}
