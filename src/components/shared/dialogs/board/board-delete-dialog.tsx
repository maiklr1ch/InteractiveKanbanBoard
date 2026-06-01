"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";
import { Api } from "../../../../../services/api-client";
import type { IBoard } from "../../../../../@types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IBoardDeleteDialog {
    board: IBoard;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onDelete: (boardId: string) => void;
}

export const BoardDeleteDialog: FC<IBoardDeleteDialog> = ({
    board,
    isOpen,
    setIsOpen,
    onDelete,
}) => {
    const handleDelete = async () => {
        try {
            await Api.boards.remove(board.id);
            onDelete(board.id);
            toast.success("Дошку видалено");
        } catch {
            toast.error("Помилка видалення дошки");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити дошку?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Дошка{` "${board.name}" `}
                        та всі її колонки і завдання будуть видалені назавжди.
                        Цю дію не можна скасувати.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Скасувати
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={handleDelete}
                    >
                        Так, видалити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
