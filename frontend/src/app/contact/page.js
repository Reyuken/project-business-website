"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Auto-clear status message after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setStatus(`❌ ${data.message || "Failed to send message."}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Server not responding.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex-1">
        {/* Contact Form Section */}
        <div className="max-w-md mx-auto py-12 px-6">
          <h1 className="text-2xl font-bold mb-4 text-black">Contact Clusterpal</h1>

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
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="border rounded w-full p-2"
              rows="4"
              required
            />
            <button
              type="submit"
              disabled={status === "Sending..."}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                status === "Sending..." ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
               Send
            </button>
          </form>

          {status && (
            <p
              className={`mt-3 font-medium ${
                status.startsWith("✅")
                  ? "text-green-600"
                  : status.startsWith("❌")
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-900 to-red-950 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="text-left max-w-md">
            <h2 className="text-lg font-semibold text-yellow-300 mb-2">
              For Further Inquiries, Contact:
            </h2>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <span className="font-medium text-yellow-200">Email:</span> admin@clusterpal.com
              </li>
              <li>
                <span className="font-medium text-yellow-200">Phone Number:</span> +63 928 947 8804
              </li>
              <li>
                <span className="font-medium text-yellow-200">Facebook Page:</span>{" "}
                <Link 
                  href="https://www.facebook.com/p/Clusterpal-100093008121350/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-orange-400 hover:text-blue-400"
                >
                  Clusterpal PH
                </Link>
              </li>
              <li>
                <span className="font-medium text-yellow-200">Office Address:</span> Unit 1102, Park Centrale Bldg., IT Park, Jose Ma. Del Mar St., Lahug, Cebu City
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4 text-sm">
        © {new Date().getFullYear()} Clusterpal BPO. All rights reserved.
      </footer>
      </div>
    </>
  );
}
