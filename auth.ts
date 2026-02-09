
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { authConfig } from "./auth.config"
import { User } from "@prisma/client"

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials
                const user = await prisma.user.findUnique({
                    where: { email: email as string },
                }) as User
                if (!user) return null
                const passwordsMatch = await compare(password as string, user.password)
                if (passwordsMatch) return user
                return null
            },
        }),
    ],
})
