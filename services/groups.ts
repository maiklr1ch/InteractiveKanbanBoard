import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants";
import type { IGroup, TCreateGroup, TUpdateGroup } from "../@types"

export const create = async (payload: TCreateGroup): Promise<IGroup> => {
  const { data } = await axiosInstance.post<IGroup>(ApiRoutes.GROUPS, payload)
  return data
}

export const update = async (id: string, { name }: TUpdateGroup): Promise<IGroup> => {
  const { data } = await axiosInstance.put<IGroup>(ApiRoutes.MANAGE_GROUP + id, { name })
  return data
}

export const remove = async (id: string): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.MANAGE_GROUP + id)
}