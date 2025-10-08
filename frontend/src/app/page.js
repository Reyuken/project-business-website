import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center text-center p-10">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">Welcome to Clusterpal</h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Your trusted BPO partner for customer support, data management, and digital solutions.
        </p>
        <a
          href="/contact"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
