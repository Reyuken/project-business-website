import Navbar from "@/components/Navbar";
export default function ContactPage() {
  return (
    <>
        <Navbar/>
        <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-6">
            Get in touch with Clusterpal. We'd love to hear from you.
        </p>

        <form className="space-y-4">
            <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 p-3 rounded-lg"
            />
            <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            />
            <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg"
            ></textarea>
            <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
            Send Message
            </button>
        </form>
        </div>
    </>
  );
}
