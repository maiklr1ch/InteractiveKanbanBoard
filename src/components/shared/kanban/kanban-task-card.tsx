"use client";

import { FC, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { ITask } from "../../../../@types";
import { cn } from "@/lib";
import { Calendar, Eye, Flag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskViewDialog } from "../dialogs/task/task-view-dialog";
import { TaskEditDialog } from "../dialogs/task/task-edit-dialog";
import { TaskDeleteDialog } from "../dialogs/task/task-delete-dialog";

interface IKanbanTaskCard {
    task: ITask;
    index: number;
    onUpdate: (updatedTask: ITask) => void;
    onDelete: (taskId: string) => void;
}

const PRIORITY_COLORS: Record<number, string> = {
    1: "border-l-slate-500",
    2: "border-l-blue-400",
    3: "border-l-blue-500",
    4: "border-l-yellow-400",
    5: "border-l-yellow-500",
    6: "border-l-orange-400",
    7: "border-l-orange-500",
    8: "border-l-red-400",
    9: "border-l-red-500",
    10: "border-l-red-600",
};

export const KanbanTaskCard: FC<IKanbanTaskCard> = ({
    task,
    index,
    onUpdate,
    onDelete,
}) => {
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const dueDate = new Date(task.dueDate);
    const isOverdue = !task.isDone && dueDate < new Date();

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setIsViewOpen(true)}
                        className={cn(
                            "group bg-slate-700 rounded-lg p-3 border-l-4",
                            "hover:bg-slate-600 transition-colors select-none",
                            snapshot.isDragging &&
                                "shadow-lg rotate-1 opacity-90",
                            PRIORITY_COLORS[task.priority] ??
                                "border-l-slate-500"
                        )}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <p
                                className={cn(
                                    "text-sm font-medium text-white",
                                    task.isDone && "line-through text-slate-400"
                                )}
                            >
                                {task.name}
                            </p>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-6 w-6 shrink-0 text-slate-400 cursor-pointer",
                                            "opacity-0 group-hover:opacity-100 transition-opacity"
                                        )}
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsViewOpen(true);
                                        }}
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Переглянути
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditOpen(true);
                                        }}
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Редагувати
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400 focus:text-red-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteOpen(true);
                                        }}
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Видалити
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {task.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-xs",
                                    isOverdue
                                        ? "text-red-400"
                                        : "text-slate-400"
                                )}
                            >
                                <Calendar className="w-3 h-3" />
                                {dueDate.toLocaleDateString("uk-UA")}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Flag className="w-3 h-3" />
                                {task.priority}
                            </span>
                        </div>
                    </div>
                )}
            </Draggable>

            <TaskViewDialog
                task={task}
                isOpen={isViewOpen}
                setIsOpen={setIsViewOpen}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />

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
    );
};
