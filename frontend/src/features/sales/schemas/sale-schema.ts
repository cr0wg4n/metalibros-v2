import { z } from 'zod'

export const saleSchema = z.object({
  bookId: z.string().min(1, 'Selecciona un libro'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  revenue: z.coerce.number().min(0, 'El ingreso no puede ser negativo'),
  soldAt: z.string().min(1, 'La fecha es obligatoria'),
})

export type SaleFormValues = z.infer<typeof saleSchema>
