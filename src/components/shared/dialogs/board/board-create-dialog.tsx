"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { IBoard } from "../../../../../@types";
import { boardFormSchema } from "../form/schemas";
import { Api } from "../../../../../services/api-client";
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
import { Textarea } from "@/components/ui";
import { BOARD_COLORS } from "@/lib/board-colors";

type TBoardForm = z.infer<typeof boardFormSchema>;

interface IBoardCreateDialog {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setBoards: Dispatch<SetStateAction<IBoard[]>>;
}

export const BoardCreateDialog: FC<IBoardCreateDialog> = ({
    isOpen,
    setIsOpen,
    setBoards,
}) => {
    const form = useForm({
        resolver: zodResolver(boardFormSchema),
        defaultValues: { name: "", description: "", color: "#3b82f6" },
    });

    const onSubmit = async (data: TBoardForm) => {
        try {
            const board = await Api.boards.create(data);
            setBoards((prev) => [board, ...prev]);
            setIsOpen(false);
            form.reset();
            toast.success("Дошку створено!");
        } catch {
            toast.error("Помилка створення дошки");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Створення дошки</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="grid gap-2">
                                <Label>Назва</Label>
                                <Input
                                    placeholder="Назва дошки"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <div className="grid gap-3">
                                <Label htmlFor="desc">Опис (опціонально)</Label>
                                <Textarea
                                    placeholder="Введіть опис дошки"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="color"
                        control={form.control}
                        render={({ field }) => (
                            <div className="grid gap-2">
                                <Label>Колір</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {BOARD_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110
                        ${
                            field.value === color
                                ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                                : ""
                        }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                                field.onChange(color)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Скасувати</Button>
                    </DialogClose>
                    <Button
                        className="cursor-pointer"
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Створити
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
