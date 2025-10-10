"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Registering...");

    try {
      // 1️⃣ Register the user
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "guest" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setStatus("✅ Registration successful! Logging in...");

      // ✅ Wait a short moment before auto-login to ensure DB commit
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 2️⃣ Auto-login
      const loginRes = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || "Login failed");

      // 3️⃣ Save token and redirect
      localStorage.setItem("token", loginData.token);
      router.push("/status"); // Make sure this matches your guest page route
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Guest Register</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
      {status && <p className="mt-3 text-gray-600">{status}</p>}
    </div>
  );
}
