import { logout } from "@/actions/auth"
import Link from "next/link"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50/50">
            <div className="w-full flex-none md:w-64 bg-slate-900/95 text-white p-6 flex flex-col justify-between shadow-xl backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-indigo-400 tracking-tight">Dashboard</h2>
                    <nav className="space-y-3">
                        <Link href="/dashboard" className="flex items-center space-x-3 py-2.5 px-4 bg-slate-800/50 rounded-lg text-slate-100 transition-all hover:bg-slate-700/50 hover:translate-x-1">
                            <span>Overview</span>
                        </Link>
                        <Link href="/dashboard/study" className="flex items-center space-x-3 py-2.5 px-4 bg-slate-800/50 rounded-lg text-slate-100 transition-all hover:bg-slate-700/50 hover:translate-x-1">
                            <span>Study Notes (AI)</span>
                        </Link>
                        {/* Add more links here */}
                    </nav>
                </div>
                <div>
                    <form action={logout}>
                        <button className="w-full text-left py-2.5 px-4 rounded-lg flex items-center text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
        </div>
    )
}
