"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [router]);

  if (loading) return <p className="p-6">Loading messages...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Dashboard</h1>
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-100">
                <td className="border p-2">{msg.name}</td>
                <td className="border p-2">{msg.email}</td>
                <td className="border p-2">{msg.message}</td>
                <td className="border p-2">
                  {new Date(msg.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
