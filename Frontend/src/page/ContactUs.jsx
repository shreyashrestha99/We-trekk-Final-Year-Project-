import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      <Navbar />

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
            Get In Touch
          </p>
          <h1 className="text-4xl font-black text-white">Contact Us</h1>
          <p className="mt-2" style={{ color: "#9CA3AF" }}>
            We are here to help you plan your next adventure
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase mb-4"
                style={{ color: "#AAFF00" }}>
                Contact Info
              </p>
              <h2 className="text-2xl font-black text-white mb-6">
                Reach Out To Us
              </h2>
            </div>

            {[
              {
                icon: "📧",
                title: "Email Us",
                info: "info@wetrekk.com",
                sub: "We reply within 24 hours"
              },
              {
                icon: "📞",
                title: "Call Us",
                info: "+977 98XXXXXXXX",
                sub: "Mon-Fri, 9AM to 6PM"
              },
              {
                icon: "📍",
                title: "Visit Us",
                info: "Kathmandu, Nepal",
                sub: "Thamel, Ward No. 26"
              }
            ].map((item) => (
              <div
                key={item.title}
                className="flex space-x-4 p-4 rounded-xl"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: "#AAFF0020", border: "1px solid #AAFF00" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="text-sm" style={{ color: "#AAFF00" }}>{item.info}</p>
                  <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{item.sub}</p>
                </div>
              </div>
            ))}

            {/* SOCIAL */}
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <p className="font-bold text-white mb-3">Follow Us</p>
              <div className="flex space-x-3">
                {[
                  { id: 'FB', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
                  { id: 'IG', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                  { id: 'TW', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> },
                  { id: 'YT', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
                ].map((s) => (
                  <div
                    key={s.id}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                    style={{ backgroundColor: "#0A0F1C", color: "#AAFF00", border: "1px solid #AAFF00" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#AAFF00";
                      e.currentTarget.style.color = "#0A0F1C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#0A0F1C";
                      e.currentTarget.style.color = "#AAFF00";
                    }}
                  >
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div
            className="md:col-span-2 p-8 rounded-xl"
            style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
          >

            {/* SUCCESS */}
            {success && (
              <div
                className="mb-6 p-4 rounded-lg text-center"
                style={{ backgroundColor: "#AAFF0020", border: "1px solid #AAFF00" }}
              >
                <p className="font-bold text-lg" style={{ color: "#AAFF00" }}>
                  ✅ Message Sent!
                </p>
                <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                  We will get back to you within 24 hours.
                </p>
              </div>
            )}

            <h2 className="text-2xl font-black text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid md:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-md p-3 text-white text-sm outline-none"
                    style={{
                      backgroundColor: "#0A0F1C",
                      border: `1px solid ${errors.name ? "#EF4444" : "#1F2937"}`
                    }}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#AAFF00"}
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
                    placeholder="Your email"
                    className="w-full rounded-md p-3 text-white text-sm outline-none"
                    style={{
                      backgroundColor: "#0A0F1C",
                      border: `1px solid ${errors.email ? "#EF4444" : "#1F2937"}`
                    }}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#AAFF00"}
                    onBlur={e => e.target.style.borderColor = errors.email ? "#EF4444" : "#1F2937"}
                  />
                  {errors.email && (
                    <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                      ⚠ {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Subject
                </label>
                <select
                  className="w-full rounded-md p-3 text-sm outline-none"
                  style={{
                    backgroundColor: "#0A0F1C",
                    border: `1px solid ${errors.subject ? "#EF4444" : "#1F2937"}`,
                    color: formData.subject ? "white" : "#6B7280"
                  }}
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#AAFF00"}
                  onBlur={e => e.target.style.borderColor = errors.subject ? "#EF4444" : "#1F2937"}
                >
                  <option value="">Select a subject</option>
                  <option value="trek">Trek Enquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="guide">Guide Verification</option>
                  <option value="vendor">Vendor Registration</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                    ⚠ {errors.subject}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-md p-3 text-white text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "#0A0F1C",
                    border: `1px solid ${errors.message ? "#EF4444" : "#1F2937"}`
                  }}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#AAFF00"}
                  onBlur={e => e.target.style.borderColor = errors.message ? "#EF4444" : "#1F2937"}
                />
                {errors.message && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                    ⚠ {errors.message}
                  </p>
                )}
                <p className="text-xs mt-1 text-right" style={{ color: "#6B7280" }}>
                  {formData.message.length} characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3 rounded-md font-bold text-sm"
                style={{
                  backgroundColor: "#AAFF00",
                  color: "#0A0F1C",
                  opacity: loading || success ? 0.7 : 1,
                  cursor: loading || success ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Sending..." : success ? "Message Sent ✓" : "Send Message"}
              </button>
            </form>
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

export default ContactUs;