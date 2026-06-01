import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma-client"
import { getSession } from "@/lib/get-session"

interface IParams {
  params: Promise<{ groupId: string }>
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId } = await params
  const { name } = await req.json()

  const group = await prisma.group.update({
    where: { id: groupId },
    data: { name },
  })

  return NextResponse.json(group)
}

export async function DELETE(_: NextRequest, { params }: IParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId } = await params

  await prisma.group.delete({ where: { id: groupId } })

  return NextResponse.json({ success: true })
}