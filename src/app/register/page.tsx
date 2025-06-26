"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Register
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition mt-2"
        >
          Go to Login
        </button>
      </form>
    </div>
  );
}
