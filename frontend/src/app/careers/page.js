"use client";

import Navbar from "@/components/Navbar";
export default function CareersPage() {
  const jobs = [
    { id: 1, title: "Software Engineer", location: "Remote", type: "Full-time" },
    { id: 2, title: "UI/UX Designer", location: "Manila, PH", type: "Contract" },
    { id: 3, title: "QA Tester", location: "Remote", type: "Part-time" },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Careers at ClusterPal</h1>
        <p className="mb-6 text-gray-700">
          Explore current job openings and join our growing team!
        </p>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.location} • {job.type}</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
