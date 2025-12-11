"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/lib/api/profile";
import type { UserProfile, GetProfileResponse } from "@/types/profile";

type AuthContextValue = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res: GetProfileResponse = await getProfile();
        setUser(res.user);
      } catch (err) {
        console.error("Failed to load profile", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
