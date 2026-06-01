
import * as z from "zod";

export const taskFormSchema = z.object({
    name: z
        .string()
        .min(1, "Назва є обов'язковою")
        .max(100, "Назва має містити не більше 100 символів"),
    description: z
        .string()
        .max(500, "Опис не має бути більшим за 500 символів")
        .nullable(),
    priority: z
        .number()
        .min(1, "Пріоритет має бути не менше 1")
        .max(10, "Пріоритет має бути не більше 10"),
    isDone: z.boolean(),
    dueDate: z.date("Дата виконання є обов'язковою"),
});

export const boardFormSchema = z.object({
    name: z
        .string()
        .min(1, "Назва є обов'язковою")
        .max(100),
    description: z
        .string()
        .max(500)
        .optional(),
    color: z
        .string()
        .default("#3b82f6"),
})

export const groupFormSchema = z.object({
    name: z
        .string()
        .min(1, "Назва є обов'язковою")
        .max(100),
})