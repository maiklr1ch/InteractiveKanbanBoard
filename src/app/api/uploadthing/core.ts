import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { prisma } from "../../../../prisma/prisma-client"
import { getSession } from "@/lib/get-session"

const f = createUploadthing()

export const uploadFileRouter = {
  avatarUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getSession()
      if (!session?.user) throw new UploadThingError("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.ufsUrl ?? file.url
      try {
        await prisma.user.update({
          where: { id: metadata.userId },
          data: { image: imageUrl },
        })
      } catch (error) {
        console.error("[UPLOADTHING] Помилка запису в БД:", error)
        throw error
      }

      return { url: imageUrl }
    })
} satisfies FileRouter

export type UploadFileRouter = typeof uploadFileRouter