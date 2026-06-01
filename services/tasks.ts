import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants";
import type { ITask, TCreateTask, TUpdateTask } from "../@types";

export const fetchAll = async (): Promise<ITask[]> => {
  const data = (await axiosInstance.get<ITask[]>(ApiRoutes.TASKS)).data
  data.map(task => task.dueDate = new Date(task.dueDate))
  return data;
}

export const create = async (payload: TCreateTask): Promise<ITask> => {
  const { data } = await axiosInstance.post<ITask>(ApiRoutes.TASKS, payload)
  return data
}

export const update = async (id: string, payload: TUpdateTask): Promise<ITask> => {
  const { data } = await axiosInstance.put<ITask>(ApiRoutes.MANAGE_TASK + id, payload)
  return data
}

export const remove = async (id: string): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.MANAGE_TASK + id);
}