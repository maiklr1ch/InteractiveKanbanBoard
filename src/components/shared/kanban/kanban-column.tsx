"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { IGroup, ITask } from "../../../../@types";
import { cn } from "@/lib";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanTaskCard } from "./kanban-task-card";
import { TaskCreateDialog } from "../dialogs/task/task-create-dialog";
import { Api } from "../../../../services/api-client";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui";
import { GroupDeleteDialog, GroupEditDialog } from "../dialogs";

interface IKanbanColumn {
    group: Required<IGroup>;
    setGroups: Dispatch<SetStateAction<Required<IGroup>[]>>;
}

export const KanbanColumn: FC<IKanbanColumn> = ({ group, setGroups }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    const handleUpdateTask = (updatedTask: ITask) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          tasks: g.tasks.map((t) =>
                              t.id === updatedTask.id ? updatedTask : t
                          ),
                      }
                    : g
            )
        );
    };

    const handleDeleteTask = (taskId: string) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.id === group.id
                    ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
                    : g
            )
        );
    };

    return (
        <>
            <div className="shrink-0 w-72 bg-slate-800 rounded-xl flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 select-none">
                    <h3 className="font-semibold text-white">
                        {group.name}
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            {group.tasks.length
                                ? `${
                                      group.tasks.filter((t) => t.isDone).length
                                  }/${group.tasks.length}`
                                : 0}
                        </span>
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 cursor-pointer"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-red-400 focus:text-red-400"
                                onClick={() => setIsDeleteOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Видалити
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Droppable droppableId={group.id} type="task">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "flex-1 p-3 flex flex-col gap-2 min-h-25 transition-colors",
                                snapshot.isDraggingOver && "bg-slate-700/50"
                            )}
                        >
                            {group.tasks.map((task, index) => (
                                <KanbanTaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <div className="p-3 border-t border-slate-700">
                    <Button
                        variant="ghost"
                        className="w-full text-slate-400 hover:text-black cursor-pointer select-none"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Додати завдання
                    </Button>
                </div>
            </div>

            <TaskCreateDialog
                groupId={group.id}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                setGroups={setGroups}
            />

            <GroupEditDialog
                group={group}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onUpdate={(updatedGroup) =>
                    setGroups((prev) =>
                        prev.map((g) =>
                            g.id === updatedGroup.id ? updatedGroup : g
                        )
                    )
                }
            />
            <GroupDeleteDialog
                group={group}
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                onDelete={(groupId) =>
                    setGroups((prev) => prev.filter((g) => g.id !== groupId))
                }
            />
        </>
    );
};
