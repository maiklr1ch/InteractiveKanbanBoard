import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

interface IParams {
  params: Promise<{ taskId: string }>
}

const updateTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Назва завдання має містити від 1 символа")
    .max(100, "Назва завдання має містити до 100 символів")
    .optional(),
  description: z
    .string()
    .max(500, "Опис завдання має містити до 500 символів")
    .optional(),
  priority: z
    .number()
    .min(1, "Пріоритет має бути не менше 1")
    .max(10, "Пріоритет має бути не більше 10")
    .optional(),
  isDone: z
    .boolean()
    .default(false)
    .optional(),
  dueDate: z
    .date()
    .optional(),
  groupId: z // movement between columns (groups)
    .string()
    .optional(),
  order: z // movement inside particular column
    .number()
    .optional(),
})

export async function PUT(req: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { taskId } = await params

  try {
    const body = await req.json()
    if(body.dueDate) body.dueDate = new Date(body.dueDate)
    const data = updateTaskSchema.parse(body)
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data
    })

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { taskId } = await params

  await prisma.task.delete({ where: { id: taskId } })

  return NextResponse.json({ success: true })
}