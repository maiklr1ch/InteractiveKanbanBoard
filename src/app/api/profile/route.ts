import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Ім'я має містити від 2 символів")
    .max(50, "Ім'я має містити до 50 символів")
    .optional(),
  image: z
    .url("'Зображення' має бути валідним URL")
    .optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = updateProfileSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, image: true },
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}