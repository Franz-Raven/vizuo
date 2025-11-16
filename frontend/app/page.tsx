"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      router.push("/home")
    } else {
      router.push("/landing")
    }
  }, [router])
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Vizuo</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
