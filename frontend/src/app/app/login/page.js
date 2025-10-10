"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setStatus("✅ Logged in!");
      // Redirect based on role
      if (data.user.role === "admin") router.push("/admin/dashboard");
      else router.push("/app/status");
    } else {
      setStatus("❌ " + data.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      {status && <p className="mt-3 text-gray-600">{status}</p>}
    </div>
  );
}
