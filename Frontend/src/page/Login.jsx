import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Validate fields
  const validate = () => {
    const newErrors = {};

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

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await API.post(
        "/api/auth/login",
        { email, password }
      );

      // Save to context
      login(res.data.user, res.data.token);

      // Show success message
      setSuccess(true);

      // Redirect based on role from backend
      const role = res.data.user.role;
      setTimeout(() => {
        if (role === "Trekker") navigate("/trekker/dashboard");
        else if (role === "Guide") navigate("/guide/dashboard");
        else if (role === "LocalVendor") navigate("/vendor/dashboard");
        else if (role === "Admin") navigate("/admin/dashboard");
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0A0F1C" }}
    >
      {/* HEADER */}
      <header
        style={{
          backgroundColor: "#0A0F1C",
          borderBottom: "1px solid #1F2937",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-black cursor-pointer"
            style={{ color: "#AAFF00" }}
            onClick={() => navigate("/")}
          >
            WeTrekk
          </div>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm rounded-md font-semibold"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            Join Now
          </button>
        </div>
      </header>

      {/* FORM */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md p-8 rounded-xl"
          style={{
            backgroundColor: "#1A2235",
            border: "1px solid #1F2937",
          }}
        >
          {/* SUCCESS MESSAGE */}
          {success && (
            <div
              className="mb-6 p-4 rounded-lg text-center"
              style={{
                backgroundColor: "#AAFF0020",
                border: "1px solid #AAFF00",
              }}
            >
              <p className="font-bold text-lg" style={{ color: "#AAFF00" }}>
                ✅ Login Successful!
              </p>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {/* GENERAL ERROR */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: "#EF444420",
                border: "1px solid #EF4444",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>
                ❌ {errors.general}
              </p>
            </div>
          )}

          {/* TITLE */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">
              Welcome Back
            </h2>
            <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
              Login to your WeTrekk account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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
                onFocus={(e) =>
                  (e.target.style.borderColor = errors.email
                    ? "#EF4444"
                    : "#AAFF00")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email
                    ? "#EF4444"
                    : "#1F2937")
                }
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-white">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs"
                  style={{ color: "#AAFF00" }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-md p-3 text-white text-sm outline-none pr-16"
                  style={{
                    backgroundColor: "#0A0F1C",
                    border: `1px solid ${
                      errors.password ? "#EF4444" : "#1F2937"
                    }`,
                  }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: "" });
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = errors.password
                      ? "#EF4444"
                      : "#AAFF00")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.password
                      ? "#EF4444"
                      : "#1F2937")
                  }
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
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-md font-bold text-sm transition-colors"
              style={{
                backgroundColor:
                  loading || success ? "#88CC00" : "#AAFF00",
                color: "#0A0F1C",
                opacity: loading || success ? 0.8 : 1,
                cursor:
                  loading || success ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Logging in..."
                : success
                ? "Success! Redirecting..."
                : "Login"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p
            className="text-sm text-center mt-6"
            style={{ color: "#9CA3AF" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold"
              style={{ color: "#AAFF00" }}
            >
              Register
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #1F2937",
        }}
        className="py-4"
      >
        <p className="text-center text-sm" style={{ color: "#6B7280" }}>
          © 2025 WeTrekk. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;