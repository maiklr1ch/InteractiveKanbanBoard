import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

interface IParams {
  params: Promise<{ boardId: string }>
}

const updateBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Назва дошки має містити від 1 символа")
    .max(100, "Назва дошки має містити до 100 символів")
    .optional(),
  description: z
    .string()
    .max(500, "Опис має містити до 500 символів")
    .optional(),
  color: z
    .string()
    .optional()
})

export async function GET(_: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { boardId } = await params

  const board = await prisma.board.findFirst({
    where: { id: boardId, userId: session.user.id },
    include: {
      groups: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
    },
  })

  if (!board) return NextResponse.json({ error: "Дошку не знайдено" }, { status: 404 })

  return NextResponse.json(board)
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { boardId } = await params

  try {
    const body = await req.json()
    const data = updateBoardSchema.parse(body)

    const board = await prisma.board.updateMany({
      where: { id: boardId, userId: session.user.id },
      data,
    })

    if (board.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { boardId } = await params

  await prisma.board.deleteMany({
    where: { id: boardId, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}