
import Link from "next/link"
import { ArrowRight, LayoutDashboard, ShieldCheck, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-lg font-bold">DashNeone</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            href="/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-indigo-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Secure & Modern Dashboard
                  <br />
                  Powered by <span className="text-indigo-600">Neon DB</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A role-based access control system built with Next.js, Prisma, and NextAuth. Admin approval workflow included.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href="/signup"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href="https://github.com"
                  target="_blank"
                >
                  View Code
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-gray-500">
                  Secure admin and user roles. Admins have full control over user approvals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">User Management</h3>
                <p className="text-gray-500">
                  Streamlined workflow for handling new user registrations and access requests.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Modern Stack</h3>
                <p className="text-gray-500">
                  Built with Next.js 14, Tailwind CSS, and Neon Serverless Postgres.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-light text-sm text-gray-500">
        <p>© 2024 Your Company. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
