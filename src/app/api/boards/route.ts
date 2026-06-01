import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Назва дошки має містити від 1 символа")
    .max(100, "Назва дошки має містити до 100 символів"),
  description: z
    .string()
    .max(500, "Опис має містити до 500 символів")
    .optional(),
  color: z
    .string()
    .default("#3b82f6"),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const boards = await prisma.board.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(boards)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = createBoardSchema.parse(body)

    const board = await prisma.board.create({
      data: { ...data, userId: session.user.id },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}