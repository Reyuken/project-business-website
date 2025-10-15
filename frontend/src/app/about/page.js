import Navbar from "@/components/Navbar";
export default function About() {
  return (
    <>
      <Navbar/>
      <div className="p-8 max-w-4xl mx-auto text-gray-800">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          About Clusterpal
        </h1>

        {/* The Story */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">The Story</h2>
          <p className="leading-relaxed mb-4">
            Founded in January 2023 with an ambition to support workforce requirements from International Companies to the Philippines and thus providing job opportunities to Filipinos through Outsourcing.
          </p>
          <p className="leading-relaxed mb-4">
            The name <span className="font-semibold text-blue-700">Clusterpal </span>  
            comes from the words <em>“Cluster”</em> and <em>“Pal”</em> — representing 
            our belief in unity and partnership. Just as clusters are groups that 
            work better together, we see every client as a pal — a trusted ally in 
            achieving shared success.
          </p>
          <p className="leading-relaxed">
            We pride ourselves with honesty, integrity and bringing the right people together to support clients worldwide.      What started as a simple idea — to help organizations focus on what they do
            best — has evolved into a mission to redefine how outsourcing supports
            business success.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Mission</h2>
          <p className="leading-relaxed">
           To help our clients grow their businesses by providing exceptional outsourcing services in a cost-efficient platform.
          </p>
        </section>

        {/* Vision */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Vision</h2>
          <p className="leading-relaxed">
            To be one of the most trusted business process outsourcing companies in the Philippines.
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Core Values</h2>
          <ul className="list-disc list-inside leading-relaxed space-y-2">
            <li><strong>C</strong> – Competent individuals</li>
            <li><strong>L</strong> – Level-headed people</li>
            <li><strong>U</strong> – Understanding clients’ needs</li>
            <li><strong>S</strong> – Good stewards of clients’ business processes</li>
            <li><strong>T</strong> – Teamwork</li>
            <li><strong>E</strong> – Equality and</li>
            <li><strong>R</strong> – Respect amongst colleagues and peers</li>
            <li><strong>P</strong> – Passion in everything we do</li>
            <li><strong>A</strong> – Accountability in our actions</li>
            <li><strong>L</strong> – Leadership to serve the common good</li>
          </ul>
        </section>

        {/* Services Offered */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Services Offered</h2>
          <p className="leading-relaxed mb-3">
            Clusterpal provides a wide range of non-voice business process outsourcing services
            designed to support companies in their daily operations with efficiency and reliability.
          </p>
          <ul className="list-disc list-inside leading-relaxed space-y-2">
            <li>Finance and Accounting</li>
            <li>Bookkeeping Services</li>
            <li>Recruitment</li>
            <li>And other related non-voice support solutions</li>
          </ul>
        </section>

        {/* Closing Quote */}
        <p className="text-gray-600 italic text-center mt-10">
          Empowering businesses. Enabling people. Elevating performance.
        </p>
      </div>

    </>
  );
}
