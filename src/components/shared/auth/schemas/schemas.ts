import * as z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email("Невалідний email"),
  password: z
    .string()
    .min(1, "Пароль є обов'язковим"),
})

export type TLoginForm = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Ім'я має містити від 2 символів")
      .max(50, "Ім'я має містити до 50 символів"),
    email: z
      .email("Невалідний email"),
    password: z
      .string()
      .min(8, "Пароль має містити від 8 символів"),
    confirmPassword: z
      .string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  })

export type TRegisterForm = z.infer<typeof registerSchema>

