"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT payload without verification (just for role)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ role: payload.role });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login"); // redirect after logout
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-700">ClusterPal</h1>

      <div className="space-x-4">
        <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
        <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        <Link href="/careers" className="text-gray-600 hover:text-blue-600">Careers</Link>

        {!user && (
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">Login</Link>
        )}

        {user?.role === "guest" && (
          <>
            <Link href="/status" className="text-gray-600 hover:text-blue-600 font-semibold">My Submissions</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold">Logout</button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
