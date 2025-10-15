"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative text-white text-center py-20 px-4 overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/clusterpal-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay (optional for darker tint) */}
        <div className="absolute inset-0 bg-black/5 bg-opacity-50"></div>

        {/* Foreground Content */}
        <div className="relative flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <Image
              src="/images/clusterpalLogo.png"
              alt="ClusterPal Logo"
              width={180}
              height={60}
              priority
            />
            <h2
              className="text-4xl md:text-5xl font-bold text-orange-400"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              CLUSTERPAL
            </h2>
          </div>

          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-100">
            We provide reliable and scalable BPO solutions that help companies focus on growth while we handle the rest.
          </p>

          <a
            href="/contact"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>



      {/* Services Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-black mb-12">Our Services</h2>
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
        <h2 className="text-3xl font-bold text-black mb-6">Why Choose Clusterpal?</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          Clusterpal is a trusted BPO partner that helps businesses scale with dependable outsourcing solutions.
          With our customer-first approach, global expertise, and commitment to excellence — we turn operations into opportunities.
        </p>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-900 to-red-950 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          
          {/* Further Inquiries (Left Side) */}
          <div className="text-left max-w-md">
            <h2 className="text-lg font-semibold text-yellow-300 mb-2">
              For Further Inquiries, Contact:
            </h2>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <span className="font-medium text-yellow-200">Email:</span> admin@clusterpal.com
              </li>
              <li>
                <span className="font-medium text-yellow-200">Phone Number:</span> +63 928 947 8804
              </li>
              <li>
                <span className="font-medium text-yellow-200">Facebook Page:</span>{" "}
                <Link 
                  href="https://www.facebook.com/p/Clusterpal-100093008121350/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-orange-400 hover:text-blue-600"
                >
                  Clusterpal PH
                </Link>
              </li>

              <li>
                <span className="font-medium text-yellow-200">Office Address:</span> Unit 1102, Park Centrale Bldg., IT Park, Jose Ma. Del Mar St., Lahug, Cebu City
              </li>
            </ul>
          </div>

          {/* Get in Touch (Right Side) */}
          <div className="flex flex-col justify-center md:items-end text-center md:text-right flex-1">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Grow with Us?</h2>
              <a
                href="/contact"
                className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition inline-block"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4 text-sm">
        © {new Date().getFullYear()} Clusterpal BPO. All rights reserved.
      </footer>
    </>
  );
}
