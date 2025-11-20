"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Careers() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.log("Not logged in");
      }
    }
    fetchUser();
  }, []);

  // Fetch jobs
  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Jobs response:", data);
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        setLoading(false);
      });
  }, []);

  const openApplyModal = (job) => {
    if (!user) return router.push("/login?redirect=/careers");
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob || !resumeFile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to apply.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      alert("Resume must be under 5MB.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("jobId", selectedJob.id);
    formData.append("resume", resumeFile);
    formData.append("applicant_name", user.name);
    formData.append("applicant_email", user.email);
    try {
      const response = await fetch(`${API_URL}/api/careers/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Application submitted successfully!");
        setShowModal(false);
        setResumeFile(null);
      } else {
        alert(data.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading job openings...</p>;
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
            <li key={job.id} className="relative border p-6 rounded-md shadow hover:shadow-lg transition duration-200">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              {job.created_at && (
                <p className="text-gray-500 text-sm">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>
              )}
              <button className="text-sm text-gray-700 hover:text-blue-500" onClick={() => setIsOpenDescription(job.id)}>
                  View Full Description
              </button>

                {/* modal for description */}
                {isOpenDescription === job.id && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    onClick={() => setIsOpenDescription(null)} // close on background click
                  >
                    <div
                      className="relative pt-10 bg-white rounded-lg p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal
                    >
                      <button
                        onClick={() => setIsOpenDescription(null)}
                        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Close
                      </button>
                      <h2 className="font-semibold ">{job.title}</h2>
                      <div dangerouslySetInnerHTML={{ __html: job.description }} />
                    </div>
                  </div>                 
                )}

              <button
                className="absolute bottom-2 right-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => openApplyModal(job)}
              >
                Apply
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h2>
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input type="text" value={user?.name || ""} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input type="email" value={user?.email || ""} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
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
                <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
