import { apiService } from "@/lib/api";

const API_BASE_URL = "http://localhost:8080/api/auth";

export async function registerUser(data: { username: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Registration failed");
    }

    const result = await res.json();
    apiService.setToken(result.token);
    
    // Store user email for upload functionality
    if (typeof window !== "undefined" && result.user && result.user.email) {
        localStorage.setItem("userEmail", result.user.email);
    }
    
    return result;
}

export async function loginUser(data: { identifier: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Login failed");
    }

    const result = await res.json();
    apiService.setToken(result.token);
    
    // Store user email for upload functionality
    if (typeof window !== "undefined" && result.user && result.user.email) {
        localStorage.setItem("userEmail", result.user.email);
    }
    
    return result;
}

export function logoutUser() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
    }
}
