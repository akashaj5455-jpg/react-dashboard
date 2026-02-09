
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { approveUser, rejectUser } from "@/actions/admin"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        redirect("/login")
    }

    if (user.role === "ADMIN") {
        const pendingUsers = await prisma.user.findMany({
            where: { status: "PENDING" },
        })

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {pendingUsers.length === 0 ? (
                            <li className="px-4 py-4 sm:px-6">No pending users.</li>
                        ) : (
                            pendingUsers.map((pendingUser) => (
                                <li key={pendingUser.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 truncate">{pendingUser.name}</p>
                                        <p className="text-sm text-gray-500">{pendingUser.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={approveUser.bind(null, pendingUser.id)}>
                                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                                Approve
                                            </button>
                                        </form>
                                        <form action={rejectUser.bind(null, pendingUser.id)}>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                Reject
                                            </button>
                                        </form>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        )
    }

    if (user.status === "PENDING") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Account Pending Approval</h1>
                    <p className="text-gray-600">Please wait for an administrator to approve your account.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <div className="mt-4 p-4 bg-green-100 rounded text-green-700">
                Your account status is: <strong>{user.status}</strong>
            </div>
        </div>
    )
}
