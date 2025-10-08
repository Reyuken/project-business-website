import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Welcome to RayTech Solutions
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We build modern, reliable, and scalable web solutions for your business.
        </p>
        <a
          href="/contact"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Contact Us
        </a>
      </main>
    </>
  );
}
