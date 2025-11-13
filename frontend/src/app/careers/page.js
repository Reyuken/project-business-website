"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        setLoading(false);
      });
  }, []);

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    const formData = new FormData();
    formData.append("name", applicantName);
    formData.append("email", applicantEmail);
    if (resumeFile) formData.append("resume", resumeFile);

    try {
      const response = await fetch(`${API_URL}/api/jobs/${selectedJob.id}/apply`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setShowModal(false);
        setApplicantName("");
        setApplicantEmail("");
        setResumeFile(null);
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    }
  };

  if (loading)
    return <p className="p-8 text-center">Loading job openings...</p>;

  if (jobs.length === 0)
    return (
      <>
        <Navbar />
        <p className="p-8 text-center">No job openings available at the moment.</p>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Career Opportunities</h1>

        <ul className="space-y-6">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border p-6 rounded-md shadow hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="mb-2">{job.description}</p>
              {job.created_at && (
                <p className="text-gray-500 text-sm">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => openApplyModal(job)}
              >
                Apply
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Apply for {selectedJob.title}
            </h2>
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Resume</label>
                <input
                  type="file"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
