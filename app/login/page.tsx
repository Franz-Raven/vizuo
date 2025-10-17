import Footer from "@/components/footer"

export default function Login() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-140 -left-140 h-[180vh] w-[180vh] rounded-full blur-[130px] opacity-70"
                    style={{ backgroundImage: "radial-gradient(closest-side, var(--color-secondary), transparent 70%)" }} />
                <div className="absolute -bottom-190 -right-140 h-[250vh] w-[250vh] rounded-full blur-[140px] opacity-70"
                    style={{ backgroundImage: "radial-gradient(closest-side, var(--color-primary), transparent 70%)" }} />
            </div>

            <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-10 md:gap-16 lg:gap-24">
                <section className="hidden flex-1 md:flex">
                    <div className="self-center">
                        <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">Welcome,<br />Designer!</h1>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md flex-1">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-center text-3xl font-extrabold">Log in</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold">Username or Email</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="block text-sm font-semibold">Password</label>
                                    <a href="#" className="text-xs font-semibold underline">Forgot Password?</a>
                                </div>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-border" />
                                <span className="text-xs opacity-70">or continue with</span>
                                <div className="h-px flex-1 bg-border" />
                            </div>

                            <div className="space-y-3">
                                <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.6 12.227c0-.68-.06-1.36-.18-2.027H12v3.84h5.4a4.62 4.62 0 0 1-2 3.033v2.507h3.24c1.9-1.747 2.96-4.32 2.96-7.353z" /><path d="M12 22c2.7 0 4.96-.893 6.613-2.42l-3.24-2.506c-.9.6-2.053.947-3.373.947-2.593 0-4.787-1.747-5.573-4.093H3.06v2.58A10 10 0 0 0 12 22z" /><path d="M6.427 13.927A6.004 6.004 0 0 1 6.107 12c0-.667.12-1.313.32-1.927V7.493H3.06A9.996 9.996 0 0 0 2 12c0 1.6.38 3.113 1.06 4.507l3.367-2.58z" /><path d="M12 5.987c1.473 0 2.787.507 3.827 1.507l2.867-2.867C16.947 2.747 14.7 2 12 2A10 10 0 0 0 3.06 7.493l3.366 2.58C7.213 7.733 9.407 5.987 12 5.987z" /></svg>
                                    Continue with Google
                                </button>

                                <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M16.365 1.43c0 1.14-.45 2.205-1.172 3.04-.746.86-1.96 1.518-3.163 1.43-.143-1.1.468-2.25 1.19-3.07.75-.86 2.07-1.49 3.145-1.4zM20.9 17.04c-.563 1.296-.826 1.86-1.54 3.01-1.003 1.59-2.416 3.57-4.185 3.586-1.56.015-1.963-1.06-4.08-1.05-2.116.01-2.564 1.07-4.123 1.056-1.77-.017-3.12-1.8-4.123-3.39-2.83-4.48-3.13-9.74-1.383-12.51 1.244-1.98 3.2-3.15 5.045-3.15 1.87 0 3.05 1.08 4.6 1.08 1.52 0 2.44-1.08 4.61-1.08 1.65 0 3.4.9 4.64 2.45-4.07 2.23-3.42 8.04.66 9.39z" /></svg>
                                    Continue with Apple
                                </button>

                                <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 5.02 3.66 9.19 8.44 10v-7.07H7.9v-2.93h2.4V9.66c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.93h-2.22V22c4.78-.81 8.44-4.98 8.44-9.93z" /></svg>
                                    Continue with Facebook
                                </button>
                            </div>

                            <button type="submit" className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring">
                                Log in
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
