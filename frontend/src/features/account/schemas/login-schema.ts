import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Ingresa un correo válido').min(1, 'El correo es obligatorio'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
