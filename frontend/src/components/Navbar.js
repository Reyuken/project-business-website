"use client";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-700">ClusterPal</h1>

      <div className="space-x-4">
        <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
        <a href="/about" className="text-gray-600 hover:text-blue-600">About</a>
        <a href="/contact" className="text-gray-600 hover:text-blue-600">Contact</a>
        <a href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">Login</a>
      </div>
    </nav>
  );
}
