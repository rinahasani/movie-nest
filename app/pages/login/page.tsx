"use client";

import React, { useState } from "react";
import { AuthSlider } from "../../../components/AuthSlider";
import { ERROR_MESSAGES } from "../../../constants/strings";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";            // adjust path to your firebase.ts

export default function LoginPage() {
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", credential.user.uid);
      setSuccess("Successfully logged in! 🎉");
    } catch (err: any) {
      console.error(err);
      setError(err.message || ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="bg-black flex flex-col md:flex-row w-full min-h-screen">
      {/* LEFT: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 bg-black">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Welcome back!</h1>
          <p className="text-gray-300">Please login with your email and password.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 text-white">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-white">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg"
            >
              LOG IN
            </button>
          </form>

          {error   && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <p className="text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT: Slider */}
      <AuthSlider
        title="Welcome back to Movie Nest"
        subtitle="Login and continue exploring your favorite movies!"
        emoji="🎬"
      />
    </div>
);
}
