"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Server not responding.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Contact Clusterpal</h1>

        {/* Contact Form */}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>

        {status && <p className="mt-3 text-gray-600">{status}</p>}

        {/* Further Inquiries Section */}
        <div className="mt-10 border-t pt-6 text-gray-700">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            For Further Inquiries, Contact:
          </h2>
          <ul className="space-y-1">
            <li>
              <span className="font-medium">Email:</span> admin@clusterpal.com
            </li>
            <li>
              <span className="font-medium">Phone Number:</span> +63 928 947 8804
            </li>
            <li>
              <span className="font-medium">Facebook Page:</span> Clusterpal PH
            </li>
            <li>
              <span className="font-medium">Office Address:</span> Unit 1102, Park Centrale Bldg., IT Park, Jose Ma. Del Mar St., Lahug, Cebu City
            </li>
          </ul>
        </div>
      </div>

    </>
  );
}
