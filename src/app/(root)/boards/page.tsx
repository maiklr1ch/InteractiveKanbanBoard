import { getSession } from "@/lib/get-session"
import { prisma } from "../../../../prisma/prisma-client"
import { BoardsGrid } from "@/components/shared"

export default async function BoardsPage() {
  const session = await getSession()

  const boards = await prisma.board.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Мої дошки</h1>
      <BoardsGrid initialBoards={boards} />
    </div>
  )
}