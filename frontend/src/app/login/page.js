"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (data.user.role === "admin") router.push("/admin/dashboard");
      else router.push("/status");
    } else {
      setStatus("❌ " + data.message);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="max-w-sm mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded w-full p-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Login
          </button>
        </form>

        {/* ✅ Register Button */}
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 underline"
          >
            Register
          </button>
        </p>

        {status && <p className="mt-3 text-gray-600">{status}</p>}
      </div>
    </>
  );
}
