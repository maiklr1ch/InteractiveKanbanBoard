"use client";

import { FC, useState } from "react";
import { IBoard } from "../../../../@types";
import { BoardCard } from "./board-card";
import { BoardsControl } from "./boards-control";
import { LayoutGrid } from "lucide-react";

interface IBoardsGrid {
    initialBoards: IBoard[];
}

export const BoardsGrid: FC<IBoardsGrid> = ({ initialBoards }) => {
    const [boards, setBoards] = useState<IBoard[]>(initialBoards);

    if (boards.length === 0) {
        return (
            <>
                <BoardsControl setBoards={setBoards} />
                <div className="text-center text-slate-400 py-20">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Дошок ще немає</p>
                    <p className="text-sm mt-1">
                        Створіть першу дошку, щоб почати
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <BoardsControl setBoards={setBoards} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        setBoards={setBoards}
                    />
                ))}
            </div>
        </>
    );
};
