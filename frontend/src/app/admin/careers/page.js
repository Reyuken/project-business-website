"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function AdminCareers() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const router = useRouter();

  // Get token safely
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const sampleDescription = `        
      <h2>Job Responsibilities</h2>
        <ul>
          <li>Responsibility 1</li>
          <li>Responsibility 2</li>
        </ul>
        <h2>Requirements</h2>
        <ul>
          <li>Requirement 1</li>
          <li>Requirement 2</li>
        </ul>
      `;
  const editor = useEditor({
    extensions: [StarterKit],
    content: sampleDescription || "",
    immediatelyRender: false,

    onUpdate: ({ editor }) => setDescription(editor.getHTML()),

    editorProps: {
      attributes: {
        class: "prose p-2 w-full min-h-[200px] border rounded",
      },

      handleKeyDown(view, event) {
        if (event.key !== "Tab") return false;

        const { state, dispatch } = view;
        const { from } = state.selection;

        // Check if inside list item
        const insideList = state.selection.$from.parent.type.name === "listItem";

        // If inside list → allow Tiptap to manage indentation
        if (insideList) return false;

        // For non-list cases, prevent browser's default tab behavior
        event.preventDefault();

        const spaces = "\u00A0\u00A0\u00A0\u00A0";

        // SHIFT + TAB → Outdent
        if (event.shiftKey) {
          const before = state.doc.textBetween(Math.max(0, from - 4), from);
          const count = (before.match(/\u00A0/g) || []).length;

          if (count > 0) {
            dispatch(state.tr.delete(from - count, from));
          }
          return true;
        }

        // TAB → Insert spaces
        dispatch(state.tr.insertText(spaces, from, from));
        return true;
      },
    },
  });

      

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/jobs", {
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
    const content = editor.getHTML(); // get editor content as HTML
    if (!title || !description) return alert("Please fill all fields");

    try {
      const res = await fetch("http://localhost:5000/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description:content }),
      });

      if (!res.ok) {
        const error = await res.json();
        return alert(error.message || "Failed to add job");
      }

      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
      setTitle("");
      editor.commands.setContent(''); // reset editor
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

// Toggle active or inactive job
const toggleActive = async (id, currentState) => {
  
  const newState = !currentState;
  setTogglingId(id); // mark this job as toggling

  // Optimistic UI update
  setJobs(prev =>
    prev.map(job => (job.id === id ? { ...job, active: newState } : job))
  );

  try {
    const res = await fetch(`http://localhost:5000/api/admin/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active: newState }), // send 'active' to backend
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update job");

    // Sync server response
    setJobs(prev =>
      prev.map(job => (job.id === id ? data : job))
    );
  } catch (err) {
    console.error(err);
    alert(err.message);

    // revert if update fails
    setJobs(prev =>
      prev.map(job =>
        job.id === id ? { ...job, active: currentState } : job
      )
    );
  } finally {
    setTogglingId(null); // done toggling
  }

};



  return (
    <>
      <Navbar />

      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Careers</h1>

        {/* Add Job Form */}
        <div>
          {/* Button to open modal */}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Job
          </button>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Job</h2>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 w-full mb-4 rounded"
                />
                <div className="border rounded mb-4 min-h-[150px]">
                  {editor && <EditorContent editor={editor} />}
                </div>

                <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTitle("");               // reset title
                    editor.commands.setContent(sampleDescription); // reset editor content
                  }}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                  <button
                    onClick={()=>{
                      handleAddJob(); 
                      setIsOpen(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
                  >
                    Add Job
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border p-4 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className="font-semibold ">{job.title}</h2>
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
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="text-red-600 font-bold hover:text-red-800"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleActive(job.id, job.active_check)}
                  disabled={togglingId === job.id}
                  className={`font-bold px-2 py-1 rounded ${
                    job.active_check
                      ? "text-green-600 hover:text-green-800"
                      : "text-red-600 hover:text-red-800"
                  } ${togglingId === job.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {job.active_check ? "Active" : "Inactive"}
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
}
