"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      
      setToast({ message: "All fields are required", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      saveToken(res.token);
      setToast({ message: "Login successful!", type: "success" });
      router.push("/dashboard");
    } catch (error: any) {
      setToast({ message: error?.message || "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white p-6">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
          toast.type === "success" ? "bg-success text-white" : "bg-danger text-white"
        }`}>
          {toast.message}
        </div>
      )}
      <div className="bg-card p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Login
        </h1>

        <input 
          type="email"
          value={email}
          placeholder="Email"
          className="w-full p-2 mb-3 bg-dark border border-gray-600 rounded" 
          onChange={(e) => setEmail(e.target.value)}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        />

        <input 
          type="password"
          value={password}
          placeholder="Password"
          className="w-full p-2 mb-3 bg-dark border border-gray-600 rounded" 
          onChange={(e) => setPassword(e.target.value)}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-black py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account? 
          <span
            onClick={() => router.push("/register")}
            className="text-primary cursor-pointer hover:underline ml-1"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}