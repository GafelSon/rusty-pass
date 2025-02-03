"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { CiRedo } from "react-icons/ci";

export default function Home() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0); // Store strength as a number from 0 to 4
  const [length, setLength] = useState(24); // Default password length

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY >= 0 && event.clientY <= 50) {
        // Call Rust function to enable drag region
        invoke("set_drag_region", { enable: true });
      } else {
        // Call Rust function to disable drag region
        invoke("set_drag_region", { enable: false });
      }
    };

    // Add mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Ensure drag region is removed on cleanup
      invoke("set_drag_region", { enable: false });
    };
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Call the Rust function via Tauri API
    const strengthScore = await invoke("password_strength", {
      password: newPassword,
    });

    // Update strength state with the result from Rust
    setStrength(strengthScore as number);
  };

  const handleGeneratePassword = async () => {
    // Call the Rust function to generate the password
    const generatedPassword = await invoke("pass_gen", { length });
    setPassword(generatedPassword as string);

    // Optionally, calculate the strength of the generated password
    const strengthScore = await invoke("password_strength", {
      password: generatedPassword,
    });
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
            <p className="lable-tie">Password:</p>
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
                backgroundColor:
                  strength >= 1
                    ? "var(--red)"
                    : strength === -1000
                      ? "var(--red)"
                      : "var(--box)",
                width: strength >= 1 ? "10%" : "8%",
                transition: "width 0.5s ease-in-out",
              }}
            />
            <div
              className="strength-bar medium"
              style={{
                backgroundColor:
                  strength >= 2
                    ? "var(--orange)"
                    : strength === -1000
                      ? "var(--red)"
                      : "var(--box)",
                width: strength >= 2 ? "50%" : "25%",
                transition: "width 0.5s ease-in-out",
              }}
            />
            <div
              className="strength-bar strong"
              style={{
                backgroundColor:
                  strength >= 5
                    ? "var(--green)"
                    : strength === -1000
                      ? "var(--red)"
                      : "var(--box)",
                width: strength === 5 ? "100%" : "60%",
                transition: "width 0.5s ease-in-out",
              }}
            />
            <p id="s-status">Strength</p>
          </div>

          {strength === -1000 ? (
            <div className="msg">kir kadi maro</div>
          ) : undefined}
        </div>

        <p className="lable-tie mt-8 pb-2">Length:</p>
        <div className="radio-group w-full">
          <label>
            <input
              type="radio"
              name="length"
              value="6"
              onChange={() => setLength(6)}
            />
            <span className="custom-radio">6.len</span>
          </label>
          <label>
            <input
              type="radio"
              name="length"
              value="8"
              onChange={() => setLength(8)}
            />
            <span className="custom-radio">8.len</span>
          </label>
          <label>
            <input
              type="radio"
              name="length"
              value="16"
              onChange={() => setLength(16)}
            />
            <span className="custom-radio">16.len</span>
          </label>
          <label>
            <input
              type="radio"
              name="length"
              value="24"
              onChange={() => setLength(24)}
              checked={length === 24}
            />
            <span className="custom-radio">24.len</span>
          </label>
        </div>
      </main>

      <div className="btn-big">
        <button className="btn-b gen" onClick={handleGeneratePassword}>
          Generate
        </button>
        <button className="btn-b regen">
          <CiRedo />
        </button>
      </div>
    </div>
  );
}
