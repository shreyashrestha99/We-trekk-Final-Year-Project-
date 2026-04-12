import React from 'react';
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
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
            <p className="text-sm mb-2 cursor-pointer" style={{ color: "#9CA3AF" }} onClick={() => navigate("/explore")}>
              Explore Treks
            </p>
            <p className="text-sm mb-2 cursor-pointer" style={{ color: "#9CA3AF" }} onClick={() => navigate("/register")}>
              Register
            </p>
            <p className="text-sm mb-2 cursor-pointer" style={{ color: "#9CA3AF" }} onClick={() => navigate("/login")}>
              Login
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Company</h4>
            <p className="text-sm mb-2 cursor-pointer" style={{ color: "#9CA3AF" }} onClick={() => navigate("/about")}>
              About Us
            </p>
            <p className="text-sm mb-2 cursor-pointer" style={{ color: "#9CA3AF" }} onClick={() => navigate("/contact")}>
              Contact Us
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Follow Us</h4>
            <div className="flex space-x-3">
              {[
                { id: 'FB', url: 'https://facebook.com', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
                { id: 'IG', url: 'https://instagram.com', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { id: 'TW', url: 'https://twitter.com', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> },
                { id: 'YT', url: 'https://youtube.com', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
              ].map(social => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                  style={{ backgroundColor: "#1A2235", color: "#AAFF00", border: "1px solid #AAFF00" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#AAFF00";
                    e.currentTarget.style.color = "#1A2235";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1A2235";
                    e.currentTarget.style.color = "#AAFF00";
                  }}
                >
                  {social.icon}
                </a>
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
  );
}

export default Footer;
