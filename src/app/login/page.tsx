"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("token", data.token); // Save JWT
    router.push("/notes");
  } else {
    alert("Login failed.");
  }
};

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </div>
    </main>
  );
}
