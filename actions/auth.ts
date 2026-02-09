
"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signup(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { message: "Missing required fields" }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { message: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)

    // First user is admin, others are users
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "ADMIN" : "USER"
    const status = role === "ADMIN" ? "APPROVED" : "PENDING"

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            status,
        },
    })

    redirect("/login")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return "Invalid credentials."
        }
        throw error
    }
}
