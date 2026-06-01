"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { boardFormSchema } from "../form/schemas";
import { Api } from "../../../../../services/api-client";
import type { IBoard } from "../../../../../@types";
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
import { cn } from "@/lib";
import { BOARD_COLORS } from "@/lib/board-colors";
import { Textarea } from "@/components/ui";

type TBoardForm = z.infer<typeof boardFormSchema>;

interface IBoardEditDialog {
    board: IBoard;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onUpdate: (updatedBoard: IBoard) => void;
}

export const BoardEditDialog: FC<IBoardEditDialog> = ({
    board,
    isOpen,
    setIsOpen,
    onUpdate,
}) => {
    const form = useForm({
        resolver: zodResolver(boardFormSchema),
        values: {
            name: board.name,
            description: board.description ?? "",
            color: board.color,
        },
    });

    const onSubmit = async (data: TBoardForm) => {
        try {
            await Api.boards.update(board.id, data);
            onUpdate({ ...board, ...data });
            setIsOpen(false);
            toast.success("Дошку оновлено");
        } catch {
            toast.error("Помилка оновлення дошки");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редагування дошки</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="grid gap-3">
                                <Label htmlFor="board-name">Назва</Label>
                                <Input
                                    id="board-name"
                                    placeholder="Назва дошки"
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
                        render={({ field }) => (
                            <div className="grid gap-3">
                                <Label htmlFor="board-desc">
                                    Опис (опціонально)
                                </Label>
                                <Textarea
                                    id="board-desc"
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
                            <div className="grid gap-3">
                                <Label>Колір</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {BOARD_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={cn(
                                                "w-8 h-8 rounded-full cursor-pointer",
                                                "transition-transform hover:scale-110",
                                                field.value === color &&
                                                    "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                                            )}
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
                        Зберегти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
