"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Footer from "@/components/footer"
import BackgroundBlobs from "@/components/background-blobs"
import { registerUser } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        setError("")

        try {
            await registerUser({ username, email, password })
            router.push("/home")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to register")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <BackgroundBlobs />

            <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-10 md:gap-16 lg:gap-24">
                <section className="hidden flex-1 md:flex">
                    <div className="self-center">
                        <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">Join Us,<br />Designer!</h1>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md flex-1">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-center text-3xl font-extrabold">Sign Up</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground transition hover:opacity-95"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>

                            <p className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <a href="/login" className="ml-2 font-semibold hover:text-primary">
                                    Log in
                                </a>
                            </p>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
