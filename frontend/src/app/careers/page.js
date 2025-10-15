"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function CareersPage() {
  const jobs = [
    { id: 1, title: "Software Engineer", location: "Remote", type: "Full-time" },
    { id: 2, title: "UI/UX Designer", location: "Manila, PH", type: "Contract" },
    { id: 3, title: "QA Tester", location: "Remote", type: "Part-time" },
  ];

  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", resume: "" });
  const [status, setStatus] = useState("");

  const openForm = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedJob(null);
    setFormData({ name: "", email: "", resume: "" });
    setStatus("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting application...");
    try {
      // Example: submit to your backend API
      const res = await fetch("http://localhost:5000/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, jobId: selectedJob.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setStatus("✅ Application submitted successfully!");
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-black">Careers at ClusterPal</h1>
        <p className="mb-6 text-gray-700">
          Explore current job openings and join our growing team!
        </p>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.location} • {job.type}</p>
              </div>
              <button
                onClick={() => openForm(job)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={closeForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">
                Apply for {selectedJob?.title}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
                <input
                  type="text"
                  name="resume"
                  placeholder="Resume URL or LinkedIn"
                  value={formData.resume}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  Submit Application
                </button>
              </form>
              {status && (
                <p className={`mt-3 ${status.startsWith("❌") ? "text-red-600" : "text-gray-600"}`}>
                  {status}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
