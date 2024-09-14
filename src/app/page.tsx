"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0); // Store strength as a number from 0 to 4

  useEffect(() => {
    // Mouse movement handler for Tauri drag region
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY >= 0 && event.clientY <= 50) {
        document.documentElement.setAttribute("data-tauri-drag-region", "true");
      } else {
        document.documentElement.removeAttribute("data-tauri-drag-region");
      }
    };

    // Add mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeAttribute("data-tauri-drag-region");
    };
  }, []);

  // Function to check password strength and update strength value
  const checkPasswordStrength = (password: string) => {
    let score = 0;

    // Check password length
    if (password.length >= 8) score++;
    
    if (/[a-z]/.test(password) || /[A-Z]/.test(password)) score++;

    // Check if it contains both lower and uppercase characters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

    // Check if it contains numbers
    if (/\d/.test(password)) score++;

    // Check if it contains special characters
    if (/[\W_]/.test(password)) score++;

    setStrength(score);
  };

  // Handle real-time input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  return (
    <div id="app">
      <main>
        <div className="header">
          <h1>Rusty Pass</h1>
          <span>Gafelson ✦ version 0.1.0 beta</span>
        </div>

        <div id="user-interface">
          <form className="from-interaction">
            <p>Password:</p>
            <input
              type="text"
              id="password-input"
              value={password}
              onChange={handleChange}
              className="password-input"
            />
          </form>

          <div className="strength-indicator">
            <div
              className="strength-bar weak"
              style={{
                backgroundColor: strength >= 1 ? "var(--red)" : "var(--box)",
                width: strength >= 1 ? "10%" : "8%",
                transition: "width 0.5s ease-in-out",
              }}
            />
            <div
              className="strength-bar medium"
              style={{
                backgroundColor: strength >= 2 ? "var(--orange)" : "var(--box)",
                width: strength >= 2 ? "50%" : "25%",
                transition: "width 0.5s ease-in-out",
              }}
            />
            <div
              className="strength-bar strong"
              style={{
                backgroundColor: strength >= 5 ? "var(--green)" : "var(--box)",
                width: strength === 5 ? "100%" : "60%",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
