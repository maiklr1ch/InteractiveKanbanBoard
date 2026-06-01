import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants";
import type { IBoard, TCreateBoard, TUpdateBoard } from "../@types"

export const fetchAll = async (): Promise<IBoard[]> => {
  const { data } = await axiosInstance.get<IBoard[]>(ApiRoutes.BOARDS)
  return data
}

export const create = async (payload: TCreateBoard): Promise<IBoard> => {
  const { data } = await axiosInstance.post<IBoard>(ApiRoutes.BOARDS, payload)
  return data
}

export const update = async (id: string, payload: TUpdateBoard): Promise<void> => {
  await axiosInstance.put(ApiRoutes.MANAGE_BOARD + id, payload)
}

export const remove = async (id: string): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.MANAGE_BOARD + id)
}