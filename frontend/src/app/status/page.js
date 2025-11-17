"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function GuestStatusPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [applications,setApplications] = useState([]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () =>{
      try{
        // fetch messagess //
        const resMsg = await fetch("http://localhost:5000/api/messages/me", {
          headers: { Authorization: `Bearer ${token}`},
        });
        if (!resMsg.ok) throw new Error("Failed to fetch your messages");
        const msgData = await resMsg.json();
        setMessages(msgData);
          //fetch job applications //
        const resApps = await fetch("http://localhost:5000/api/careers/me", {
          headers: { Authorization: `Bearer ${token}`},
        });
        if (!resApps.ok) throw new Error("Failed to fetch your job applications");
        const appsData = await resApps.json();
        setApplications(appsData);

      } catch (err) {
        setError(err.message);
      } finally{
        setLoading(false);
      }
    };

    
    fetchData();
  }, [router]);

  if (loading) return <p className="p-6">Loading your submissions...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Your Submissions</h1>
        </div>

        {messages.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
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
                    <td className="border p-2">{new Date(msg.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4 ">Your Job Applications</h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2">Job Title</th>
                  <th className="border p-2">Resume</th>
                  <th className="border p-2">Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-100">
                    <td className="border p-2">{app.job_title}</td>
                    <td className="border p-2">
                      <a
                        href={`http://localhost:5000${app.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    </td>
                    <td className="border p-2">{new Date(app.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
}
