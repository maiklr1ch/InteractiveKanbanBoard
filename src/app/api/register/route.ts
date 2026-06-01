import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Ім'я користувача має містити від 2 символів")
    .max(50, "Ім'я користувача має містити до 50 символів"),
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8, "Пароль має містити від 8 символів")
    .max(100, "Пароль має містити до 100 символів"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}