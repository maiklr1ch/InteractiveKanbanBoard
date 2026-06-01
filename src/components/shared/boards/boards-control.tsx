"use client"

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { BoardCreateDialog } from "../dialogs/board/board-create-dialog"
import { Dispatch, SetStateAction } from "react"
import type { IBoard } from "../../../../@types"
import { cn } from "@/lib"

interface IBoardsControl {
  setBoards: Dispatch<SetStateAction<IBoard[]>>
  className?: string
}

export const BoardsControl: FC<IBoardsControl> = ({ setBoards, className }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <div className={cn(className, "flex justify-between items-center mb-6")}>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          <LayoutGrid className="w-5 h-5" />
          Створити нову дошку
        </Button>
      </div>
      <BoardCreateDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        setBoards={setBoards}
      />
    </>
  )
}