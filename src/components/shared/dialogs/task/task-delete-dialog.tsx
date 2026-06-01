import { Dispatch, FC, SetStateAction } from "react";
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
import { Api } from "../../../../../services/api-client";
import { toast } from "sonner";
import type { ITask } from "../../../../../@types";

interface ITaskDeleteDialog {
    task: ITask;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onDelete: (taskId: string) => void;
}

export const TaskDeleteDialog: FC<ITaskDeleteDialog> = ({
    isOpen,
    task,
    setIsOpen,
    onDelete,
}) => {
    const handleDelete = async () => {
        await Api.tasks.remove(task.id);
        onDelete(task.id);
        setIsOpen(false);
        toast.success("Завдання видалено");
    };

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впeвнені що хочете видалити завдання {`"${task.name}"`}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Цю дію не можна скасувати. Це назавжди видалить ваше
                        завдання без можливості відновлення.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        Скасувати
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Так, видалити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
