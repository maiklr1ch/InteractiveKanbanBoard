"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";
import { Api } from "../../../../../services/api-client";
import type { IGroup, ITask } from "../../../../../@types";
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

interface IGroupDeleteDialog {
    group: IGroup & { tasks: ITask[] };
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onDelete: (groupId: string) => void;
}

export const GroupDeleteDialog: FC<IGroupDeleteDialog> = ({
    group,
    isOpen,
    setIsOpen,
    onDelete,
}) => {
    const handleDelete = async () => {
        try {
            await Api.groups.remove(group.id);
            onDelete(group.id);
            toast.success("Колонку видалено");
        } catch {
            toast.error("Помилка видалення колонки");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити колонку?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Колонка{` "${group.name}" `}
                        та всі її завдання ({group.tasks.length}) будуть
                        видалені назавжди. Цю дію не можна скасувати.
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
