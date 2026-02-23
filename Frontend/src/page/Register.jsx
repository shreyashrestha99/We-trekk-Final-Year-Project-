import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/register", { name, email, password, role })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9]">

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
              Log In
            </button>
            <button className="px-4 py-2 text-sm bg-[#2EBDB3] text-white rounded-md hover:bg-[#28a9a0]">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* FORM SECTION */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#1B2B3A] text-center">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Please fill in your personal details to register
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 w-full border rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="mt-1 w-full border rounded-md p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full border rounded-md p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Your Role</label>
              <select
                className="mt-1 w-full border rounded-md p-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">-- Select Role --</option>
                <option value="trekker">Trekkers</option>
                <option value="admin">Admin</option>
                <option value="guide">Guide</option>
                <option value="vendor">Local Vendor</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#2EBDB3] text-white py-2 rounded-md hover:bg-[#28a9a0]"
              >
                Register
              </button>
              <button
                type="button"
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2EBDB3] font-medium">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Get in touch | Social links | © 2025 WeTrek
        </div>
      </footer>
    </div>
  );
}

export default Register;