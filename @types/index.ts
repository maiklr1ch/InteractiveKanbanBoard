export interface IUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface IBoard {
  id: string
  name: string
  description?: string | null
  color: string
  createdAt: Date
  updatedAt: Date
  userId: string
  groups?: IGroup[]
}

export interface IGroup {
  id: string
  name: string
  order: number
  boardId: string
  createdAt: Date
  updatedAt: Date
  tasks?: ITask[]
}

export interface ITask {
  id: string
  name: string
  description?: string | null
  priority: number
  isDone: boolean
  dueDate: Date
  order: number
  groupId: string
  createdAt: Date
  updatedAt: Date
}

export type TCreateBoard = Pick<IBoard, "name" | "description" | "color">
export type TUpdateBoard = Partial<TCreateBoard>

export type TCreateGroup = Pick<IGroup, "name" | "boardId">
export type TUpdateGroup = Pick<IGroup, "name">

export type TCreateTask = Pick<ITask, "name" | "description" | "priority" | "isDone" | "dueDate" | "groupId">
export type TUpdateTask = Partial<Omit<TCreateTask, "groupId">> & { groupId?: string; order?: number }