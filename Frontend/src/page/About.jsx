import { useNavigate } from "react-router-dom";

const team = [
  { name: "Shreya Shrestha", role: "Full Stack Developer", initial: "SS" },
  { name: "Prashant Gopali", role: "Client / CEO Antler Production", initial: "PG" },
  { name: "Hrishav Tandukar", role: "Internal Supervisor", initial: "HT" },
  { name: "Hitesh Shrestha", role: "External Supervisor", initial: "HS" }
];

const features = [
  {
    icon: "✓",
    title: "Verified Guides",
    desc: "All guides are licensed and verified by Nepal Tourism Board ensuring your safety on every trek."
  },
  {
    icon: "👥",
    title: "Group Coordination",
    desc: "Create or join trekking groups easily. Find companions for your next adventure."
  },
  {
    icon: "💰",
    title: "Expense Tracking",
    desc: "Track and manage your trek expenses. Generate PDF reports for complete financial transparency."
  },
  {
    icon: "🛡",
    title: "Safety First",
    desc: "Real-time seat availability, verified vendors and licensed guides keep you safe."
  },
  {
    icon: "📍",
    title: "Nepal Focused",
    desc: "Built specifically for Nepal's trekking industry with local payment options and local knowledge."
  },
  {
    icon: "⭐",
    title: "Ratings & Reviews",
    desc: "Read honest reviews from real trekkers. Rate guides and treks after your experience."
  }
];

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      {/* HEADER */}
      <header style={{ backgroundColor: "#0A0F1C", borderBottom: "1px solid #1F2937" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-black cursor-pointer"
            style={{ color: "#AAFF00" }}
            onClick={() => navigate("/")}
          >
            WeTrekk
          </div>
          <nav className="hidden md:flex space-x-6 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "Explore", path: "/explore" },
              { label: "Contact Us", path: "/contact" },
              { label: "About Us", path: "/about" }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ color: item.path === "/about" ? "#AAFF00" : "#9CA3AF" }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm rounded-md"
              style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-sm rounded-md font-semibold"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative h-64 flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,15,28,0.75)" }} />
        <div className="relative">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "#AAFF00" }}>
            Our Story
          </p>
          <h1 className="text-4xl font-black text-white">About WeTrekk</h1>
          <p className="mt-2" style={{ color: "#9CA3AF" }}>
            Nepal's trusted trek coordination platform
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#AAFF00" }}>
              Our Mission
            </p>
            <h2 className="text-3xl font-black text-white mb-6">
              Modernizing Nepal's Trekking Ecosystem
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
              WeTrekk was born out of a simple observation — trekking in Nepal is
              fragmented, unorganized, and heavily reliant on informal channels like
              Facebook groups, Instagram reels, and word of mouth.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
              Our platform centralizes everything — verified guides, trek listings,
              group coordination, bookings, payments, and expense tracking — into
              one powerful digital solution.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#9CA3AF" }}>
              We are built for Nepal, by Nepal — supporting local guides, vendors,
              and the growing community of trekkers who love this country.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "500+", label: "Verified Guides" },
              { number: "1000+", label: "Happy Trekkers" },
              { number: "50+", label: "Trek Routes" },
              { number: "98%", label: "Success Rate" }
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <p className="text-3xl font-black" style={{ color: "#AAFF00" }}>
                  {stat.number}
                </p>
                <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              What We Offer
            </p>
            <h2 className="text-3xl font-black text-white">
              Platform Features
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4"
                  style={{ backgroundColor: "#AAFF0020", border: "1px solid #AAFF00" }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "#AAFF00" }}>
            The People
          </p>
          <h2 className="text-3xl font-black text-white">Our Team</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              >
                {member.initial}
              </div>
              <h3 className="font-bold text-white">{member.name}</h3>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Start Trekking?
          </h2>
          <p className="mb-8" style={{ color: "#9CA3AF" }}>
            Join thousands of trekkers already using WeTrekk
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-md font-bold"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-3 rounded-md font-bold"
              style={{ border: "2px solid #AAFF00", color: "#AAFF00" }}
            >
              Explore Treks
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0A0F1C", borderTop: "1px solid #1F2937" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm" style={{ color: "#6B7280" }}>
            © 2025 WeTrekk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default About;