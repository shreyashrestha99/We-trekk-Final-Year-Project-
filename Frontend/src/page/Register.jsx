import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Validate each field
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!role) {
      newErrors.role = "Please select a role";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role, address }
      );

      // Show success then redirect to LOGIN
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0F1C" }}>

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
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm rounded-md"
            style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
          >
            Login
          </button>
        </div>
      </header>

      {/* FORM */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-lg p-8 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >

          {/* SUCCESS MESSAGE */}
          {success && (
            <div
              className="mb-6 p-4 rounded-lg text-center"
              style={{ backgroundColor: "#AAFF0020", border: "1px solid #AAFF00" }}
            >
              <p className="font-bold text-lg" style={{ color: "#AAFF00" }}>
                🎉 Registration Successful!
              </p>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                Account created! Redirecting to login page...
              </p>
            </div>
          )}

          {/* GENERAL ERROR */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-lg"
              style={{ backgroundColor: "#EF444420", border: "1px solid #EF4444" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>
                ❌ {errors.general}
              </p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">
              Create Account
            </h2>
            <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
              Join WeTrekk and start your adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.name ? "#EF4444" : "#1F2937"}`,
                }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                onFocus={e => e.target.style.borderColor = errors.name ? "#EF4444" : "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.name ? "#EF4444" : "#1F2937"}
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.email ? "#EF4444" : "#1F2937"}`,
                }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                onFocus={e => e.target.style.borderColor = errors.email ? "#EF4444" : "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.email ? "#EF4444" : "#1F2937"}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.address ? "#EF4444" : "#1F2937"}`,
                }}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                onFocus={e => e.target.style.borderColor = errors.address ? "#EF4444" : "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.address ? "#EF4444" : "#1F2937"}
              />
              {errors.address && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.address}
                </p>
              )}
            </div>

            {/* PASSWORD WITH SHOW/HIDE */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-md p-3 text-white text-sm outline-none pr-16"
                  style={{
                    backgroundColor: "#0A0F1C",
                    border: `1px solid ${errors.password ? "#EF4444" : "#1F2937"}`,
                  }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  onFocus={e => e.target.style.borderColor = errors.password ? "#EF4444" : "#AAFF00"}
                  onBlur={e => e.target.style.borderColor = errors.password ? "#EF4444" : "#1F2937"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                  style={{ color: "#AAFF00" }}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.password}
                </p>
              )}
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full"
                        style={{
                          backgroundColor:
                            password.length >= level * 4
                              ? level === 1 ? "#EF4444"
                              : level === 2 ? "#F59E0B"
                              : "#AAFF00"
                              : "#1F2937"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                    {password.length < 4
                      ? "Weak"
                      : password.length < 8
                      ? "Medium"
                      : "Strong"}
                  </p>
                </div>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Choose Your Role
              </label>
              <select
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.role ? "#EF4444" : "#1F2937"}`,
                  color: role ? "white" : "#6B7280"
                }}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) setErrors({ ...errors, role: "" });
                }}
                onFocus={e => e.target.style.borderColor = errors.role ? "#EF4444" : "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.role ? "#EF4444" : "#1F2937"}
              >
                <option value="">-- Select Role --</option>
                <option value="Trekker">Trekker</option>
                <option value="Guide">Guide</option>
                <option value="LocalVendor">Local Vendor</option>
              </select>
              {errors.role && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.role}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 py-3 rounded-md font-bold text-sm"
                style={{
                  backgroundColor: "#AAFF00",
                  color: "#0A0F1C",
                  opacity: loading || success ? 0.7 : 1,
                  cursor: loading || success ? "not-allowed" : "pointer"
                }}
              >
                {loading
                  ? "Creating Account..."
                  : success
                  ? "Redirecting to Login..."
                  : "Create Account"}
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-md font-bold text-sm"
                style={{ border: "1px solid #1F2937", color: "#9CA3AF" }}
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: "#9CA3AF" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold" style={{ color: "#AAFF00" }}>
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
