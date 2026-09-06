import { z } from 'zod'

export const bookSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  sellingPrice: z.coerce.number().min(0, 'El precio de venta no puede ser negativo'),
  costPrice: z.coerce.number().min(0, 'El precio real no puede ser negativo'),
  releaseDate: z.string().min(1, 'La fecha de lanzamiento es obligatoria'),
  categoryIds: z.array(z.string()),
  coverFile: z.instanceof(File).nullable(),
})

export type BookFormValues = z.infer<typeof bookSchema>
