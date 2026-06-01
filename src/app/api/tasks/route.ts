import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { z } from "zod"
import { getSession } from "@/lib/get-session"

const createTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Назва завдання має містити від 1 символа")
    .max(100, "Назва завдання має містити до 100 символів"),
  description: z
    .string()
    .max(500, "Опис завдання має містити до 500 символів")
    .optional(),
  priority: z
    .number()
    .min(1, "Пріоритет має бути не менше 1")
    .max(10, "Пріоритет має бути не більше 10"),
  isDone: z
    .boolean()
    .default(false),
  dueDate: z
    .date("Дата виконання є обов'язковою"),
  groupId: z.string(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const groupId = req.nextUrl.searchParams.get("groupId")

  const tasks = await prisma.task.findMany({
    where: groupId ? { groupId } : undefined,
    orderBy: { order: "asc" },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    body.dueDate = new Date(body.dueDate)
    const data = createTaskSchema.parse(body)

    const lastTask = await prisma.task.findFirst({
      where: { groupId: data.groupId },
      orderBy: { order: "desc" },
    })

    const task = await prisma.task.create({
      data: {
        ...data,
        order: (lastTask?.order ?? -1) + 1,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}