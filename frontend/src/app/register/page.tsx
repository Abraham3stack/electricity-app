"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
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

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      
      setToast({ message: "All fields are required", type: "error" });
      return;
    }

    try {
      setLoading(true);

      // Step 1: register
      await registerUser(name, email, password);

      // Step 2: auto login
      const res = await loginUser(email, password);

      // Step 3: save token
      saveToken(res.token);

      setToast({ message: "Account created successfully!", type: "success" });

      // Step 4: redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error: any) {
      setToast({ message: error?.message || "Registration failed", type: "error" });
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
          Register
        </h1>

        <input 
          type="text" 
          value={name}
          placeholder="Name"
          className="w-full p-2 mb-3 bg-dark border border-gray-600 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input 
          type="email"
          value={email}
          placeholder="Email"
          className="w-full p-2 mb-3 bg-dark border border-gray-600 rounded" 
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password"
          value={password}
          placeholder="Password"
          className="w-full p-2 mb-3 bg-dark border border-gray-600 rounded" 
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-primary text-black py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account? 
          <span
            onClick={() => router.push("/login")}
            className="text-primary cursor-pointer hover:underline ml-1"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}