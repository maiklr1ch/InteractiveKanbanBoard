import { prisma } from "../../../../../prisma/prisma-client";
import { notFound } from "next/navigation";
import { KanbanBoard } from "@/components/shared";
import { getSession } from "@/lib/get-session";

interface IBoardPageProps {
    params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: IBoardPageProps) {
    const session = await getSession();
    const { boardId } = await params;

    const board = await prisma.board.findFirst({
        where: { id: boardId, userId: session!.user.id },
        include: {
            groups: {
                orderBy: { order: "asc" },
                include: { tasks: { orderBy: { order: "asc" } } },
            },
        },
    });

    if (!board) notFound();

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="h-16 w-16 rounded-full mr-2"
                    style={{ backgroundColor: board.color }}
                ></div>
                <h1 className="text-2xl font-bold text-white">{board.name}</h1>
            </div>
            {board.description && (
                <p className="text-slate-400 mb-6">{board.description}</p>
            )}
            <KanbanBoard board={board} />
        </div>
    );
}
