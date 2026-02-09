
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { approveUser, rejectUser, revokeUser } from "@/actions/admin"

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
        const approvedUsers = await prisma.user.findMany({
            where: { status: "APPROVED", role: "USER" },
        })

        return (
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
                <div className="bg-white/80 backdrop-blur shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {pendingUsers.length === 0 ? (
                            <li className="px-6 py-8 text-center text-gray-500">No pending users.</li>
                        ) : (
                            pendingUsers.map((pendingUser) => (
                                <li key={pendingUser.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{pendingUser.name}</p>
                                        <p className="text-sm text-gray-500">{pendingUser.email}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <form action={approveUser.bind(null, pendingUser.id)}>
                                            <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                Approve
                                            </button>
                                        </form>
                                        <form action={rejectUser.bind(null, pendingUser.id)}>
                                            <button className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                Reject
                                            </button>
                                        </form>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <h1 className="text-3xl font-bold mb-8 text-gray-800 mt-12">Approved Users</h1>
                <div className="bg-white/80 backdrop-blur shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-700">Active Accounts</h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {approvedUsers.length === 0 ? (
                            <li className="px-6 py-8 text-center text-gray-500">No approved users.</li>
                        ) : (
                            approvedUsers.map((user) => (
                                <li key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <form action={revokeUser.bind(null, user.id)}>
                                            <button className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                Revoke Access
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
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-yellow-100 max-w-md">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-4">
                        <span className="text-3xl">⏳</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-3 text-gray-900">Account Pending</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Your account is currently awaiting administrator approval.
                        Please check back later.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">User Dashboard</h1>
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Welcome back, {user.name}!</h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Status: {user.status}</span>
                </div>
            </div>
        </div>
    )
}
