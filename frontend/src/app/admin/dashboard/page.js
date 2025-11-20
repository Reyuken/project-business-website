"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications,setApplications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState({});
  const status = ["Pending", "Under Review", "Accepted", "Declined"]
  const router = useRouter();
  
  // Handle dropdown selection
  const handleSelect = async (status, id) => {
    try {
      // Call PATCH API
      const res = await fetch(`http://localhost:5000/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update frontend immediately
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, application_status: status } : app))
      );

      // Close dropdown
      setOpenDropdown({ ...openDropdown, [id]: false });
    } catch (err) {
      console.error(err);
      alert("Error updating status");

    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchData = async () =>{
      try{
        // fetch messagess //
        const resMsg = await fetch("http://localhost:5000/api/admin/messages", {
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

  if (loading) return <p className="p-6">Loading messages...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  
  return (
    <>
    <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* ✅ Dashboard Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
        </div>

        {/* ✅ Messages Table */}
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4 ">Messages</h2>
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
                  <td className="border p-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {/*job applications */}
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4 ">Job Applications</h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2">Applicant</th>
                  <th className="border p-2">Email Address</th>
                  <th className="border p-2">Job Title</th>
                  <th className="border p-2">Resume</th>
                  <th className="border p-2">Date Applied</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-100">
                    <td className="border p-2">{app.applicant_name}</td>
                    <td className="border p-2">{app.applicant_email}</td>
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
                    <td className="border p-2">{new Date(app.applied_at).toLocaleString()}</td>
                    <td className="border p-2">{app.application_status}
                    </td>
                    <td>
                      {/* ✅ Button and dropdown JSX goes here */}
                      <button onClick={() => setOpenDropdown({ 
                          ...openDropdown, 
                          [app.id]: !openDropdown[app.id] 
                      })}>
                        <svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
                        fill={"currentColor"} viewBox="0 0 24 24">
                        {/* Boxicons v3.0.4 https://boxicons.com | License  https://docs.boxicons.com/free */}
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.08 0-2-.92-2-2s.92-2 2-2 2 .92 2 2-.92 2-2 2"></path><path d="m20.42 13.4-.51-.29c.05-.37.08-.74.08-1.11s-.03-.74-.08-1.11l.51-.29c.96-.55 1.28-1.78.73-2.73l-1-1.73a2.006 2.006 0 0 0-2.73-.73l-.53.31c-.58-.46-1.22-.83-1.9-1.11v-.6c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v.6c-.67.28-1.31.66-1.9 1.11l-.53-.31c-.96-.55-2.18-.22-2.73.73l-1 1.73c-.55.96-.22 2.18.73 2.73l.51.29c-.05.37-.08.74-.08 1.11s.03.74.08 1.11l-.51.29c-.96.55-1.28 1.78-.73 2.73l1 1.73c.55.95 1.77 1.28 2.73.73l.53-.31c.58.46 1.22.83 1.9 1.11v.6c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-.6a8.7 8.7 0 0 0 1.9-1.11l.53.31c.95.55 2.18.22 2.73-.73l1-1.73c.55-.96.22-2.18-.73-2.73m-2.59-2.78c.11.45.17.92.17 1.38s-.06.92-.17 1.38a1 1 0 0 0 .47 1.11l1.12.65-1 1.73-1.14-.66c-.38-.22-.87-.16-1.19.14-.68.65-1.51 1.13-2.38 1.4-.42.13-.71.52-.71.96v1.3h-2v-1.3c0-.44-.29-.83-.71-.96-.88-.27-1.7-.75-2.38-1.4a1.01 1.01 0 0 0-1.19-.15l-1.14.66-1-1.73 1.12-.65c.39-.22.58-.68.47-1.11-.11-.45-.17-.92-.17-1.38s.06-.93.17-1.38A1 1 0 0 0 5.7 9.5l-1.12-.65 1-1.73 1.14.66c.38.22.87.16 1.19-.14.68-.65 1.51-1.13 2.38-1.4.42-.13.71-.52.71-.96v-1.3h2v1.3c0 .44.29.83.71.96.88.27 1.7.75 2.38 1.4.32.31.81.36 1.19.14l1.14-.66 1 1.73-1.12.65c-.39.22-.58.68-.47 1.11Z"></path>
                        </svg>
                      </button>
                      {openDropdown[app.id] && (
                        <div className="absolute bg-white border p-1 ">
                        {status.map(opt => (
                          <div key={opt} onClick={() => handleSelect(opt, app.id)}
                          className="p-1 cursor-pointer hover:bg-gray-200 hover:text-blue-600 rounded"
                          >
                            {opt}
                          </div>
                      ))}
                      </div>
                      )}
                    </td>
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
