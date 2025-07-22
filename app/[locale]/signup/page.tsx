"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthSlider } from "@/components/AuthSlider";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const t = useTranslations("signup");
  const tErrors = useTranslations("errors");
  const { locale } = useParams() as { locale: string };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();

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
      setError(tErrors("passwordMismatch"));
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || tErrors("signupFailed"));
      } else {
        setSuccess("Successfully registered! 🎉");
        // Auto-login after signup
        await signInWithEmailAndPassword(auth, email, password);
        router.push(`/${locale}`);
      }
    } catch {
      setError(tErrors("network"));
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push(`/${locale}`);
    } catch (err: any) {
      const key = (err.code as string)
        .replace("auth/", "")
        .split("-")
        .map((part, i) =>
          i === 0 ? part : part[0].toUpperCase() + part.slice(1)
        )
        .join("");

      const message = tErrors(key) || tErrors("unknown");

      setError(message);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col md:flex-row w-full">
      {/* LEFT: SIGNUP FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl md:text-4xl font-extrabold text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-300">{t("description")}</p>

          <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-1 text-white">
                {t("usernameLabel")}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-white">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-white">
                {t("passwordLabel")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                minLength={8}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block mb-1 text-white"
              >
                {t("confirmPasswordLabel")}
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                minLength={8}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg"
            >
              {t("button")}
            </button>
          </form>

          {/* Social login divider */}
          <div className="flex items-center space-x-2 my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="text-gray-400 uppercase text-xs">
              {t("orContinueWith")}
            </span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Google button */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGoogle}
              className="p-3 bg-white rounded-full hover:shadow-md"
            >
              <img src="/images/google.png" alt="Google" className="h-5 w-5" />
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <p className="text-center text-gray-500 text-sm">
            {t("haveAccount")}{" "}
            <Link
              href={`/${locale}/login`}
              className="text-yellow-400 hover:underline"
            >
              {t("loginLink")}
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH SLIDER */}
      <AuthSlider title={t("title")} subtitle={t("description")} emoji="😊" />
    </div>
  );
}
