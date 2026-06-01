"use client"

import { Dispatch, FC, SetStateAction, useState } from "react"
import { ITask } from "../../../../../@types"
import { cn } from "@/lib"
import { Calendar, Flag, CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TaskEditDialog } from "./task-edit-dialog"
import { TaskDeleteDialog } from "./task-delete-dialog"

interface ITaskViewDialog {
    task: ITask
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: (updatedTask: ITask) => void
    onDelete: (taskId: string) => void
}

const PRIORITY_LABELS: Record<number, { label: string; className: string }> = {
    1:  { label: "1 - Мінімальний",  className: "bg-slate-700 text-slate-300" },
    2:  { label: "2 - Дуже низький", className: "bg-slate-700 text-slate-300" },
    3:  { label: "3 - Низький",      className: "bg-blue-900 text-blue-300" },
    4:  { label: "4 - Нижче норми",  className: "bg-blue-900 text-blue-300" },
    5:  { label: "5 - Середній",     className: "bg-yellow-900 text-yellow-300" },
    6:  { label: "6 - Вище норми",   className: "bg-yellow-900 text-yellow-300" },
    7:  { label: "7 - Високий",      className: "bg-orange-900 text-orange-300" },
    8:  { label: "8 - Дуже високий", className: "bg-red-900 text-red-300" },
    9:  { label: "9 - Критичний",    className: "bg-red-900 text-red-300" },
    10: { label: "10 - Максимальний",className: "bg-red-950 text-red-400" },
}

export const TaskViewDialog: FC<ITaskViewDialog> = ({
    task, isOpen, setIsOpen, onUpdate, onDelete,
}) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const dueDate = new Date(task.dueDate)
    const isOverdue = !task.isDone && dueDate < new Date()
    const priority = PRIORITY_LABELS[task.priority]

    const handleOpenEdit = () => {
        setIsOpen(false)
        setIsEditOpen(true)
    }

    const handleOpenDelete = () => {
        setIsOpen(false)
        setIsDeleteOpen(true)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className={cn(task.isDone && "line-through text-slate-400")}>
                            {task.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        {/* Статус */}
                        <div className="flex items-center gap-2">
                            {task.isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                            )}
                            <span className={cn(
                                "text-sm font-medium",
                                task.isDone ? "text-green-400" : "text-slate-400"
                            )}>
                                {task.isDone ? "Виконано" : "Не виконано"}
                            </span>
                        </div>

                        {/* Опис */}
                        {task.description && (
                            <div className="grid gap-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Опис</p>
                                <p className="text-sm text-black whitespace-pre-wrap">
                                    {task.description}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {/* Пріоритет */}
                            <div className="grid gap-1 flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Пріоритет</p>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md w-fit",
                                    priority?.className
                                )}>
                                    <Flag className="w-3 h-3" />
                                    {priority?.label ?? task.priority}
                                </span>
                            </div>

                            {/* Дедлайн */}
                            <div className="grid gap-1 flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Дедлайн</p>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md w-fit",
                                    isOverdue
                                        ? "bg-red-900 text-red-300"
                                        : "bg-slate-700 text-slate-300"
                                )}>
                                    <Calendar className="w-3 h-3" />
                                    {dueDate.toLocaleString("uk-UA")}
                                    {isOverdue && " (прострочено)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-row gap-2 sm:justify-between">
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleOpenDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Видалити
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={handleOpenEdit}
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Редагувати
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <TaskEditDialog
                task={task}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onUpdate={onUpdate}
            />
            <TaskDeleteDialog
                task={task}
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                onDelete={onDelete}
            />
        </>
    )
}