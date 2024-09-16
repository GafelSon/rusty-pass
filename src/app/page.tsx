"use client";

import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0); // Store strength as a number from 0 to 4

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY >= 0 && event.clientY <= 50) {
        // Call Rust function to enable drag region
        invoke('set_drag_region', { enable: true });
      } else {
        // Call Rust function to disable drag region
        invoke('set_drag_region', { enable: false });
      }
    };

    // Add mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Ensure drag region is removed on cleanup
      invoke('set_drag_region', { enable: false });
    };
  }, []);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  
    // Call the Rust function via Tauri API
    const strengthScore = await invoke('password_strength', { password: newPassword });
    
    // Update strength state with the result from Rust
    setStrength(strengthScore as number);
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
            <p>{ strength }</p>
          </div>
        </div>
        <div className="mt-8 bg-red-500">salam</div>
      </main>
    </div>
  );
}
