import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"
import type { TUpdateProfile } from "../@types"

export const update = async (payload: TUpdateProfile): Promise<void> => {
  await axiosInstance.patch(ApiRoutes.PROFILE, payload)
}