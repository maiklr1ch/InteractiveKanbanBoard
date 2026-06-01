"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { groupFormSchema } from "../form/schemas";
import { Api } from "../../../../../services/api-client";
import type { IGroup, ITask } from "../../../../../@types";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TGroupForm = z.infer<typeof groupFormSchema>;

interface IGroupEditDialog {
    group: IGroup & { tasks: ITask[] };
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onUpdate: (updatedGroup: IGroup & { tasks: ITask[] }) => void;
}

export const GroupEditDialog: FC<IGroupEditDialog> = ({
    group,
    isOpen,
    setIsOpen,
    onUpdate,
}) => {
    const form = useForm<TGroupForm>({
        resolver: zodResolver(groupFormSchema),
        values: { name: group.name },
    });

    const onSubmit = async (data: TGroupForm) => {
        try {
            const updated = await Api.groups.update(group.id, {
                name: data.name,
            });
            onUpdate({ ...group, ...updated });
            setIsOpen(false);
            toast.success("Колонку оновлено");
        } catch {
            toast.error("Помилка оновлення колонки");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Редагування колонки</DialogTitle>
                </DialogHeader>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-3">
                            <Label htmlFor="group-name">Назва колонки</Label>
                            <Input
                                id="group-name"
                                placeholder="Введіть назву колонки"
                                value={field.value}
                                onChange={field.onChange}
                                autoFocus
                            />
                            {fieldState.error && (
                                <p className="text-red-600 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Скасувати</Button>
                    </DialogClose>
                    <Button
                        className="cursor-pointer"
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Зберегти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
