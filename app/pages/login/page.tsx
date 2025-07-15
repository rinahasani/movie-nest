"use client";

import React, { useState } from "react";
import { AuthSlider } from "../../../components/AuthSlider";


export default function LoginPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!data.success) setError(data.error || "Login failed");
    else setSuccess("Successfully logged in! 🎉");
  };

  const pics = [
    "/assets/movies/movie1.jpg",
    "/assets/movies/movie2.png",
    "/assets/movies/movie3.png",
    "/assets/movies/movie4.jpg",
    "/assets/movies/movie5.png",
    "/assets/movies/movie6.png",
    "/assets/movies/movie7.jpg",
  ];

  return (
    <div className="bg-black flex flex-col md:flex-row w-full min-h-screen">
      {/* LEFT: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Welcome back!
          </h1>
          <p className="text-gray-300">
            Please login with your email and password to continue.
          </p>
          <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
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
            <div>
              <label htmlFor="password" className="block mb-1 text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg"
            >
              LOG IN
            </button>
          </form>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <a href="/pages/signup" className="text-yellow-400 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>

      <AuthSlider
      title="Welcome back to Movie Nest"
      subtitle="Login and continue exploring your favorite movies!"
      emoji="🎬"
    />
    </div>
  );
}
