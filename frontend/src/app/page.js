"use client";

import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Empowering Businesses with <span className="text-yellow-300">Clusterpal</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          We provide reliable and scalable BPO solutions that help companies focus on growth while we handle the rest.
        </p>
        <a
          href="/contact"
          className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition"
        >
          Get in Touch
        </a>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Finance & Accounting</h3>
            <p className="text-gray-600">
              Comprehensive financial management services, including reporting, analysis, and process optimization to help streamline your operations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Bookkeeping Services</h3>
            <p className="text-gray-600">
              Accurate and timely bookkeeping to ensure your business maintains transparency, compliance, and reliable financial records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Recruitment</h3>
            <p className="text-gray-600">
              End-to-end recruitment support — from sourcing to onboarding — to help you build a competent and dependable workforce.
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-10 max-w-2xl mx-auto">
          We also offer other related <span className="font-semibold">non-voice business support solutions</span> tailored to your organization’s needs.
        </p>
      </section>


      {/* About Section */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Why Choose Clusterpal?</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          Clusterpal is a trusted BPO partner that helps businesses scale with dependable outsourcing solutions.
          With our customer-first approach, global expertise, and commitment to excellence — we turn operations into opportunities.
        </p>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Grow with Us?</h2>
        <a
          href="/contact"
          className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition"
        >
          Contact Us Today
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4 text-sm">
        © {new Date().getFullYear()} Clusterpal BPO. All rights reserved.
      </footer>
    </>
  );
}
