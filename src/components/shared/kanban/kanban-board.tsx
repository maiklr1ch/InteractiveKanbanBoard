"use client";

import { FC, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import type { IBoard, IGroup } from "../../../../@types";
import { KanbanColumn } from "./kanban-column";
import { GroupCreateDialog } from "../dialogs/group/group-create-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Api } from "../../../../services/api-client";
import { toast } from "sonner";

type TKanbanBoardGroup = Required<IGroup>

interface IKanbanBoard {
    board: IBoard & { groups: TKanbanBoardGroup[] };
}

export const KanbanBoard: FC<IKanbanBoard> = ({ board }) => {
    const [groups, setGroups] = useState<TKanbanBoardGroup[]>(board.groups);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        const sourceGroup = groups.find((g) => g.id === source.droppableId);
        const destGroup = groups.find((g) => g.id === destination.droppableId);
        if (!sourceGroup || !destGroup) return;

        const sourceTasks = [...sourceGroup.tasks];
        const destTasks =
            source.droppableId === destination.droppableId
                ? sourceTasks
                : [...destGroup.tasks];

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, {
            ...movedTask,
            groupId: destination.droppableId,
        });

        setGroups((prev) =>
            prev.map((g) => {
                if (g.id === source.droppableId)
                    return { ...g, tasks: sourceTasks };
                if (g.id === destination.droppableId)
                    return { ...g, tasks: destTasks };
                return g;
            })
        );

        try {
            await Api.tasks.update(draggableId, {
                groupId: destination.droppableId,
                order: destination.index,
            });
        } catch {
            setGroups(board.groups);
            toast.error("Помилка переміщення завдання");
        }
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-6">
            <DragDropContext onDragEnd={onDragEnd}>
                {groups.map((group) => (
                    <KanbanColumn
                        key={group.id}
                        group={group}
                        setGroups={setGroups}
                    />
                ))}
            </DragDropContext>

            <div className="shrink-0">
                <Button
                    variant="outline"
                    className="h-10 cursor-pointer whitespace-nowrap select-none"
                    onClick={() => setIsCreateGroupOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Нова колонка
                </Button>
            </div>

            <GroupCreateDialog
                boardId={board.id}
                isOpen={isCreateGroupOpen}
                setIsOpen={setIsCreateGroupOpen}
                setGroups={setGroups}
            />
        </div>
    );
};
