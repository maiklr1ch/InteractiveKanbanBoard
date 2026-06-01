"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { DueDateSelector } from "../../due-date-selector";
import { Api } from "../../../../../services/api-client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "../form/schemas";
import type { ITask, TUpdateTask } from "../../../../../@types";
import { toast } from "sonner";

interface ITaskEditDialog {
    task: ITask;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onUpdate: (updatedTask: ITask) => void;
}

export const TaskEditDialog: FC<ITaskEditDialog> = ({
    isOpen,
    task,
    setIsOpen,
    onUpdate,
}) => {
    const form = useForm<z.infer<typeof taskFormSchema>>({
        resolver: zodResolver(taskFormSchema),
        mode: "onChange",
        defaultValues: task,
    });

    useEffect(() => {
        form.setValue("name", task.name);
        form.setValue("description", task.description ?? null);
        form.setValue("priority", task.priority);
        form.setValue("isDone", task.isDone);
        form.setValue("dueDate", new Date(task.dueDate));
    }, [task]);

    const onSubmit = async (data: TUpdateTask) => {
        const updated = await Api.tasks.update(task.id, data);
        onUpdate(updated);
        setIsOpen(false);
        toast.success("Завдання оновлено");
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
            }}
        >
            <form>
                <DialogContent className="sm:max-w-106">
                    <DialogHeader>
                        <DialogTitle>Редагування завдання</DialogTitle>
                        <DialogDescription>
                            Редагування інформації про певне завдання
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Назва</Label>
                                    <Input
                                        required
                                        id="name"
                                        name="name"
                                        placeholder="Введіть назву завдання"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-600 text-sm">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="grid gap-3">
                                    <Label htmlFor="desc">Опис</Label>
                                    <Textarea
                                        required
                                        name="desc"
                                        id="desc"
                                        placeholder="Введіть опис завдання"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-600 text-sm">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="priority"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="grid gap-3">
                                    <Label htmlFor="priority">Пріоритет</Label>
                                    <Input
                                        required
                                        type="number"
                                        min={1}
                                        max={10}
                                        step={1}
                                        id="priority"
                                        name="priority"
                                        placeholder="Вкажіть пріоритет завдання (1-10)"
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(+e.target.value)
                                        }
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-600 text-sm">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="dueDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="grid gap-2">
                                    <DueDateSelector
                                        date={field.value}
                                        setDate={(date) =>
                                            field.onChange(
                                                new Date(date ?? Date.now())
                                            )
                                        }
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-600 text-sm">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="isDone"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-3">
                                    <Label htmlFor="done">Виконане?</Label>
                                    <Checkbox
                                        id="done"
                                        name="done"
                                        checked={field.value}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            field.onChange(!field.value);
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild onClick={() => setIsOpen(false)}>
                            <Button variant="outline">Скасувати</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};
