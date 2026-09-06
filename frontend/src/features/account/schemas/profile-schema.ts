import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.email('Ingresa un correo válido'),
  about: z.string(),
  phone: z.string(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
