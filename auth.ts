
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
                const email = (credentials.email as string).trim()
                const password = (credentials.password as string).trim()

                console.log(`[Auth] Attempting login for: ${email}`)

                const user = await prisma.user.findUnique({
                    where: { email },
                }) as User

                if (!user) {
                    console.log(`[Auth] User not found: ${email}`)
                    return null
                }

                const passwordsMatch = await compare(password, user.password)

                if (passwordsMatch) {
                    console.log(`[Auth] Login successful for: ${email}`)
                    return user
                }

                console.log(`[Auth] Invalid password for: ${email}`)
                return null
            },
        }),
    ],
})
