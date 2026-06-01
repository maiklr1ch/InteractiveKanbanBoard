"use client"

import { Dispatch, FC, SetStateAction } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { IGroup, ITask } from "../../../../../@types"
import { groupFormSchema } from "../form/schemas"
import { Api } from "../../../../../services/api-client"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TGroupForm = z.infer<typeof groupFormSchema>

interface IGroupCreateDialog {
  boardId: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setGroups: Dispatch<SetStateAction<(IGroup & { tasks: ITask[] })[]>>
}

export const GroupCreateDialog: FC<IGroupCreateDialog> = ({
  boardId, isOpen, setIsOpen, setGroups,
}) => {
  const form = useForm<TGroupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: { name: "" },
  })

  const onSubmit = async (data: TGroupForm) => {
    try {
      const group = await Api.groups.create({ name: data.name, boardId })
      setGroups((prev) => [...prev, { ...group, tasks: [] }])
      setIsOpen(false)
      form.reset()
      toast.success("Колонку створено!")
    } catch {
      toast.error("Помилка створення колонки")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Нова колонка</DialogTitle>
        </DialogHeader>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label>Назва колонки</Label>
              <Input
                placeholder="Наприклад: Work"
                value={field.value}
                onChange={field.onChange}
                autoFocus
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Скасувати</Button>
          </DialogClose>
          <Button className="cursor-pointer" onClick={form.handleSubmit(onSubmit)}>
            Створити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}