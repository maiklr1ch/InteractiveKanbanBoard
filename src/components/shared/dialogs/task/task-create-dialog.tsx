"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Textarea,
    Button,
    Checkbox,
} from "@/components/ui";
import * as z from "zod";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DueDateSelector } from "../../due-date-selector";
import { Api } from "../../../../../services/api-client";
import { taskFormSchema } from "../form/schemas";
import type { IGroup, ITask } from "../../../../../@types";

interface ITaskCreateDialog {
    groupId: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setGroups: Dispatch<SetStateAction<(IGroup & { tasks: ITask[] })[]>>;
}

export const TaskCreateDialog: FC<ITaskCreateDialog> = ({
    isOpen,
    setIsOpen,
    groupId,
    setGroups,
}) => {

    const form = useForm<z.infer<typeof taskFormSchema>>({
        resolver: zodResolver(taskFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            priority: 10,
            isDone: false
        },
    });

    async function onSubmit(data: z.infer<typeof taskFormSchema>) {
        setIsOpen(false);
        const task = await Api.tasks.create({
            ...data,
            groupId,
            dueDate: data.dueDate,
        });
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId ? { ...g, tasks: [...g.tasks, task] } : g
            )
        );
    }

    useEffect(() => {
        form.setValue("dueDate", new Date(Date.now()))
    }, [form])

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
                        <DialogTitle>Створення завдання</DialogTitle>
                        <DialogDescription>
                            Створення нового завдання з необхідною інформацією
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
                                                date ?? new Date(Date.now() + 3600 * 24 * 1000)
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
                            Створити
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};
