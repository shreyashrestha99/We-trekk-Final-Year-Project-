import { useNavigate } from "react-router-dom";

function MainHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      {/* HEADER */}
      <header style={{ backgroundColor: "#0A0F1C", borderBottom: "1px solid #1F2937" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-bold cursor-pointer"
            style={{ color: "#AAFF00" }}
            onClick={() => navigate("/")}
          >
            WeTrekk
          </div>

          <nav className="hidden md:flex space-x-8 text-sm">
            {["Home", "Explore", "Contact Us", "About Us"].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase().replace(" ", "")}`)}
                className="transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => e.target.style.color = "#AAFF00"}
                onMouseLeave={e => e.target.style.color = "#9CA3AF"}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm rounded-md transition-colors"
              style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#AAFF00" + "20"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-sm rounded-md font-semibold transition-colors"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,15,28,0.7)" }}></div>

        <div className="relative text-white px-4">
          <p className="text-sm font-semibold mb-4 tracking-widest uppercase"
            style={{ color: "#AAFF00" }}>
            Nepal's #1 Trek Platform
          </p>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none">
            WETREKK
          </h1>
          <p className="mt-4 text-xl" style={{ color: "#9CA3AF" }}>
            Discover. Connect. Trek.
          </p>
          <p className="mt-2 text-lg max-w-2xl mx-auto" style={{ color: "#9CA3AF" }}>
            Find verified guides, join groups and book treks across Nepal
          </p>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
            >
              Explore Treks
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors"
              style={{ border: "2px solid #AAFF00", color: "#AAFF00", backgroundColor: "transparent" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#AAFF00" + "20"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* TOP TREKKING PLACES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              Popular Routes
            </p>
            <h2 className="text-3xl font-bold text-white">
              Top Trekking Places
            </h2>
          </div>
          <button
            onClick={() => navigate("/explore")}
            className="px-4 py-2 rounded-md text-sm font-semibold"
            style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
          >
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Annapurna Circuit",
              tag: "Adventure",
              price: "$800",
              days: "15 Days",
              img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
              slug: "annapurna"
            },
            {
              name: "Everest Base Camp",
              tag: "Challenging",
              price: "$1200",
              days: "14 Days",
              img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
              slug: "everest"
            },
            {
              name: "Langtang Valley",
              tag: "Moderate",
              price: "$600",
              days: "10 Days",
              img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
              slug: "langtang"
            }
          ].map((trek) => (
            <div
              key={trek.name}
              className="rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div className="relative">
                <img
                  src={trek.img}
                  className="w-full h-48 object-cover"
                  alt={trek.name}
                />
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                >
                  {trek.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg">{trek.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    {trek.days}
                  </span>
                  <span className="font-bold" style={{ color: "#AAFF00" }}>
                    {trek.price}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/trek/${trek.slug}`)}
                  className="mt-4 w-full py-2 rounded-md font-semibold text-sm transition-colors"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY WETREKK */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              Why Us
            </p>
            <h2 className="text-3xl font-bold text-white">
              Why Choose WeTrekk?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Verified Guides", desc: "All guides are licensed and verified by NTB", icon: "✓" },
              { title: "Group Coordination", desc: "Join or create trek groups easily", icon: "👥" },
              { title: "Safety First", desc: "Real-time seat tracking and safety protocols", icon: "🛡" },
              { title: "Expense Tracking", desc: "Track and split expenses with your group", icon: "💰" }
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE ADVENTURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "#AAFF00" }}>
            More Routes
          </p>
          <h2 className="text-3xl font-bold text-white">More Adventures</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Gosaikunda Trek", days: "7 Days", slug: "gosaikunda" },
            { name: "Mardi Himal", days: "5 Days", slug: "mardi" },
            { name: "Manaslu Circuit", days: "14 Days", slug: "manaslu" }
          ].map((trek) => (
            <div
              key={trek.name}
              className="p-6 rounded-xl flex justify-between items-center"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div>
                <h3 className="font-bold text-white">{trek.name}</h3>
                <span className="text-sm" style={{ color: "#AAFF00" }}>{trek.days}</span>
              </div>
              <button
                onClick={() => navigate(`/trek/${trek.slug}`)}
                className="px-4 py-2 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { number: "500+", label: "Verified Guides" },
              { number: "1000+", label: "Happy Trekkers" },
              { number: "50+", label: "Trek Routes" },
              { number: "98%", label: "Success Rate" }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black" style={{ color: "#AAFF00" }}>
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

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0A0F1C", borderTop: "1px solid #1F2937" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-black mb-3" style={{ color: "#AAFF00" }}>
                WeTrekk
              </h3>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                Nepal's trusted platform for trek coordination
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              {["Explore Treks", "Register", "Login"].map(link => (
                <p key={link} className="text-sm mb-2 cursor-pointer"
                  style={{ color: "#9CA3AF" }}
                  onClick={() => navigate(`/${link.toLowerCase().replace(" ", "")}`)}
                >
                  {link}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              {["Privacy Policy", "Terms of Service", "Contact Us"].map(link => (
                <p key={link} className="text-sm mb-2" style={{ color: "#9CA3AF" }}>
                  {link}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {["FB", "IG", "TW", "YT"].map(social => (
                  <div
                    key={social}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                    style={{ backgroundColor: "#1A2235", color: "#AAFF00", border: "1px solid #AAFF00" }}
                  >
                    {social}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1F2937" }} className="pt-4 text-center">
            <p className="text-sm" style={{ color: "#6B7280" }}>
              © 2025 WeTrekk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainHome;