import { IsIn, IsInt, IsOptional, IsString, NotEquals } from 'class-validator'

const MANUAL_MOVEMENT_TYPES = ['RESTOCK', 'ADJUSTMENT', 'RETURN'] as const

export class CreateStockMovementDto {
  @IsString()
  bookId: string

  @IsInt()
  @NotEquals(0)
  quantity: number

  @IsIn(MANUAL_MOVEMENT_TYPES)
  type: (typeof MANUAL_MOVEMENT_TYPES)[number]

  @IsOptional()
  @IsString()
  note?: string
}
