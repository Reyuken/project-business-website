"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationStatus() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/app/login");
    else setUser({ email: "guest@example.com" }); // temporary mock
  }, [router]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-3">
        Application Status
      </h1>
      {user ? (
        <div className="border rounded p-4 shadow-sm bg-gray-50">
          <p className="text-gray-700">
            Hello <b>{user.email}</b>, your application is currently being
            reviewed. Please check again soon.
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
