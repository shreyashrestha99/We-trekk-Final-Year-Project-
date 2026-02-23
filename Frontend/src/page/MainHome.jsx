function MainHome() {
  return (
    <div className="min-h-screen bg-[#F4F7F9]">

      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-[#1B2B3A]">Logo</div>

          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="#" className="text-[#1B2B3A] hover:text-[#2EBDB3]">Home</a>
            <a href="#" className="text-[#1B2B3A] hover:text-[#2EBDB3]">Explore</a>
            <a href="#" className="text-[#1B2B3A] hover:text-[#2EBDB3]">Contact Us</a>
            <a href="#" className="text-[#1B2B3A] hover:text-[#2EBDB3]">About Us</a>
          </nav>

          <div className="space-x-3">
            <button className="px-4 py-2 text-sm border border-[#1B2B3A] text-[#1B2B3A] rounded-md hover:bg-gray-50">
              Login
            </button>
            <button className="px-4 py-2 text-sm bg-[#2EBDB3] text-white rounded-md hover:bg-[#28a9a0]">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative h-96 flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Explore Now</h1>
          <p className="mt-2 text-lg">
            Discover amazing trekking adventures in Nepal
          </p>

          <div className="mt-6 space-x-3">
            <button className="px-5 py-2 bg-white text-[#1B2B3A] rounded-md">
              Browse All Treks
            </button>
            <button className="px-5 py-2 bg-[#2EBDB3] text-white rounded-md">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* TREKKING PLACES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-[#1B2B3A]">
          Top Trekking Places
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">Annapurna Circuit</h3>
              <span className="text-xs text-green-600">Adventure</span>
              <p className="text-sm text-gray-600 mt-2">Starting from $800</p>
              <button className="mt-3 px-4 py-2 bg-[#2EBDB3] text-white rounded-md text-sm">
                View Details
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">Everest Base Camp</h3>
              <span className="text-xs text-red-600">Challenging</span>
              <p className="text-sm text-gray-600 mt-2">Starting from $1200</p>
              <button className="mt-3 px-4 py-2 bg-[#2EBDB3] text-white rounded-md text-sm">
                View Details
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1499696010181-8f6031f5624d?auto=format&fit=crop&w=800&q=80"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">Langtang Valley</h3>
              <span className="text-xs text-green-600">Adventure</span>
              <p className="text-sm text-gray-600 mt-2">Starting from $600</p>
              <button className="mt-3 px-4 py-2 bg-[#2EBDB3] text-white rounded-md text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-[#1B2B3A]">
            Why Choose WeTrek
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-6">
            <div className="p-4 bg-[#F4F7F9] rounded-lg">
              <h3 className="font-semibold">Expert Guides</h3>
              <p className="text-sm text-gray-600">
                Professional and experienced trek leaders
              </p>
            </div>

            <div className="p-4 bg-[#F4F7F9] rounded-lg">
              <h3 className="font-semibold">Custom Itineraries</h3>
              <p className="text-sm text-gray-600">
                Tailor-made trekking experiences
              </p>
            </div>

            <div className="p-4 bg-[#F4F7F9] rounded-lg">
              <h3 className="font-semibold">Safety First</h3>
              <p className="text-sm text-gray-600">
                Well-planned routes and medical support
              </p>
            </div>

            <div className="p-4 bg-[#F4F7F9] rounded-lg">
              <h3 className="font-semibold">Affordable Prices</h3>
              <p className="text-sm text-gray-600">
                Best value travel experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MORE ADVENTURES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-[#1B2B3A]">
          More Adventures
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold">Gosaikunda Trek</h3>
            <span className="text-xs text-blue-600">7 Days</span>
            <button className="mt-3 px-4 py-2 bg-[#2EBDB3] text-white rounded-md text-sm">
              Explore
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold">Mardi Himal</h3>
            <span className="text-xs text-blue-600">5 Days</span>
            <button className="mt-3 px-4 py-2 bg-[#2EBDB3] text-white rounded-md text-sm">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Get in touch | Social links | © 2025 WeTrek
        </div>
      </footer>
    </div>
  );
}

export default MainHome;