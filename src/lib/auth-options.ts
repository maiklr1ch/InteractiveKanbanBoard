
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../prisma/prisma-client"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.AUTH_MAX_AGE) ?? 60 * 60 * 24 * 7 // 7d by default
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user?.password) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) return null

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    async session({ session, token }) {
      session.user.id = (token.id ?? token.sub) as string
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        select: {
          name: true,
          image: true
        }
      })
      session.user.name = user?.name
      session.user.image = user?.image
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}