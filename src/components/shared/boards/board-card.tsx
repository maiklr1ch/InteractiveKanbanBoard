"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import type { IBoard } from "../../../../@types";
import { cn } from "@/lib";
import Link from "next/link";
import { LayoutGrid, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui";
import { BoardDeleteDialog, BoardEditDialog } from "../dialogs";

interface IBoardCard {
    board: IBoard;
    className?: string;
    setBoards: Dispatch<SetStateAction<IBoard[]>>;
}

export const BoardCard: FC<IBoardCard> = ({ board, className, setBoards }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <>
            <div className="relative">
                <Link href={`/boards/${board.id}`}>
                    <div
                        className={cn(
                            className,
                            "relative rounded-xl p-5 h-50 flex flex-col justify-between cursor-pointer",
                            "hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
                        )}
                        style={{ backgroundColor: board.color }}
                    >
                        <div className="flex items-start justify-between">
                            <h3 className="text-white font-bold text-lg leading-tight">
                                {board.name}
                            </h3>
                            <LayoutGrid className="text-white/60 w-5 h-5 shrink-0" />
                        </div>
                        {board.description && (
                            <p className="text-white/70 text-sm line-clamp-2">
                                {board.description}
                            </p>
                        )}
                    </div>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2 h-7 w-7 text-white/60 cursor-pointer"
                            onClick={(e) => e.preventDefault()}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <Pencil className="w-4 h-4 mr-2" />
                            Редагувати
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-red-400 focus:text-red-400"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Видалити
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <BoardEditDialog
                board={board}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onUpdate={(updatedBoard) =>
                    setBoards((prev) =>
                        prev.map((b) =>
                            b.id === updatedBoard.id ? updatedBoard : b
                        )
                    )
                }
            />
            <BoardDeleteDialog
                board={board}
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                onDelete={(boardId) =>
                    setBoards((prev) => prev.filter((b) => b.id !== boardId))
                }
            />
        </>
    );
};
