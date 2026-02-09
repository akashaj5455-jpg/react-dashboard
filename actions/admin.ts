
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }
}

export async function approveUser(userId: string) {
    await checkAdmin()

    await prisma.user.update({
        where: { id: userId },
        data: { status: "APPROVED" },
    })

    revalidatePath("/dashboard")
}

export async function rejectUser(userId: string) {
    await checkAdmin()

    await prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
    })

    revalidatePath("/dashboard")
}
