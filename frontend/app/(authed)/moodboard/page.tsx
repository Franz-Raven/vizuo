"use client"

import BackgroundBlobs from "@/components/background-blobs"
import Header from "@/components/header"
import PrimaryButton from "@/components/ui/primary-button"

const mock = Array.from({ length: 5 })

export default function MoodboardPage() {

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <BackgroundBlobs />
            <Header />
            <main className="min-h-screen relative z-10 pt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                            Creations
                        </h1>

                        <PrimaryButton title="Create" />
                    </div>
                    <div className="h-px w-full bg-foreground mb-10" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {mock.map((_, idx) => (
                            <div key={idx} className="flex flex-col space-y-4">
                                <div className="w-full aspect-[3/4] rounded-xl bg-card/70 border border-border/60 shadow-lg shadow-black/30" />
                                <div className="space-y-2">
                                    <div className="h-2.5 w-3/4 rounded-full bg-muted" />
                                    <div className="flex flex-col space-y-1">
                                        <div className="h-1.5 w-2/3 rounded-full bg-muted/80" />
                                        <div className="h-1.5 w-1/2 rounded-full bg-muted/60" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
