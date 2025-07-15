"use client";

import React, { useState } from "react";
import { AuthSlider } from "../../../components/AuthSlider";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const name = (form.username as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirm_password as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!data.success) {
      setError(data.error);
    } else {
      setSuccess("Successfully registered! 🎉");
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col md:flex-row w-full">
      {/* LEFT: SIGNUP FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Ready to join the community?
          </h1>
          <p className="text-gray-300">
            Fill in the form below to start chilling with Movie Nest today!
          </p>
          <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-1 text-white">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block mb-1 text-white">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg"
            >
              SIGN UP
            </button>
          </form>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/pages/login" className="text-yellow-400 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH SLIDER */}
      <AuthSlider
        title="Join the Movie Nest community"
        subtitle="Dive into a cinematic universe of endless entertainment!"
        emoji="😊"
      />
    </div>
  );
}
