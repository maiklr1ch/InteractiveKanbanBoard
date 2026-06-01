import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Назва групи має містити від 1 символа")
    .max(100, "Назва групи має містити до 100 символів"),
  boardId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { name, boardId } = createGroupSchema.parse(body)

    const board = await prisma.board.findFirst({
      where: { id: boardId, userId: session.user.id },
    })
    if (!board) return NextResponse.json({ error: "Дошку не знайдено" }, { status: 404 })

    const lastGroup = await prisma.group.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    })

    const group = await prisma.group.create({
      data: { name, boardId, order: (lastGroup?.order ?? -1) + 1 },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}