"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCareers() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get token safely
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [ token]);

  if (loading) return <p className="p-6">Loading...</p>;

  // Add a new job
  const handleAddJob = async () => {
    if (!title || !description) return alert("Please fill all fields");

    try {
      const res = await fetch("http://localhost:5000/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const error = await res.json();
        return alert(error.message || "Failed to add job");
      }

      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Error adding job");
    }
  };

  // Delete a job
  const handleDeleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        setJobs(jobs.filter((job) => job.id !== id));
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete job");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };



  return (
    <>
      <Navbar />

      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Careers</h1>

        {/* Add Job Form */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 flex-2 rounded"
          />
          <button
            onClick={handleAddJob}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Job
          </button>
        </div>

        {/* Jobs List */}
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border p-4 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className="font-semibold">{job.title}</h2>
                <p>{job.description}</p>
              </div>
              <button
                onClick={() => handleDeleteJob(job.id)}
                className="text-red-600 font-bold hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
