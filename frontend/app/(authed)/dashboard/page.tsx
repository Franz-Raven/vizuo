"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import BackgroundBlobs from "@/components/background-blobs"
import { getDashboard } from "@/lib/api/dashboard"
import type { CreatorDashboardResponse } from "@/types/dashboard"
import { toast } from "sonner"
import { TrendingUp, Download, Wallet, PieChart, RefreshCw } from "lucide-react"

function formatPHP(value: number) {
  const safe = Number.isFinite(value) ? value : 0
  return `₱${safe.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value: number) {
  const safe = Number.isFinite(value) ? value : 0
  return `${(safe * 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CreatorDashboardResponse | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await getDashboard()
      setData(res)
    } catch (err) {
      console.error("Failed to load dashboard:", err)
      toast.error("Failed to load dashboard")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      <main className="relative z-10 min-h-screen pt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                {data?.monthLabel ? `Earnings overview for ${data.monthLabel}` : "Earnings overview for this month"}
              </p>
            </div>

            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 backdrop-blur-xl px-4 py-3 text-sm font-semibold shadow-lg hover:bg-card/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-7 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Your payout</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="h-9 w-40 rounded-xl bg-muted animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold">{formatPHP(data?.yourPayout ?? 0)}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on your share of premium downloads.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-7 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Your premium downloads</p>
                  <p className="text-xs text-muted-foreground">Creator downloads this month</p>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="h-9 w-28 rounded-xl bg-muted animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold">{(data?.yourPremiumDownloads ?? 0).toLocaleString("en-PH")}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Total premium downloads (all creators):{" "}
                  <span className="font-semibold text-foreground">
                    {(data?.totalPremiumDownloads ?? 0).toLocaleString("en-PH")}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-7 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Your share</p>
                  <p className="text-xs text-muted-foreground">Of premium download pool</p>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="h-9 w-32 rounded-xl bg-muted animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold">{formatPercent(data?.yourShare ?? 0)}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Share = your premium downloads / total premium downloads.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-7 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Subscription revenue</p>
                  <p className="text-xs text-muted-foreground">Active subscriptions started this month</p>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="h-8 w-44 rounded-xl bg-muted animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold">{formatPHP(data?.subscriptionRevenue ?? 0)}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Creator pool (70%):{" "}
                  <span className="font-semibold text-foreground">
                    {formatPHP(data?.creatorPool ?? 0)}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-7 shadow-2xl">
              <p className="text-sm font-semibold">How earnings are calculated</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your payout is based on the monthly creator pool (70% of subscription revenue) multiplied by your share
                of premium downloads this month.
              </p>

              <div className="mt-5 rounded-2xl border border-border bg-background/40 backdrop-blur-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Creator pool</span>
                    <span className="font-semibold">{formatPHP(data?.creatorPool ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Your share</span>
                    <span className="font-semibold">{formatPercent(data?.yourShare ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:col-span-2">
                    <span className="text-muted-foreground">Your payout</span>
                    <span className="font-semibold">{formatPHP(data?.yourPayout ?? 0)}</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Tip: More premium downloads of your premium assets increases your share.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
