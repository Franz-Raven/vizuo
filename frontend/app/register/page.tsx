import Footer from "@/components/footer"
import BackgroundBlobs from "@/components/background-blobs"

export default function Register() {
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

                        <form className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold">Username</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <button type="submit" className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring">
                                Create Account
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
