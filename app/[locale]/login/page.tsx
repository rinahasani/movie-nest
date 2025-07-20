"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AuthSlider } from "@/components/AuthSlider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";            // adjust path to your firebase.ts

export default function LoginPage() {
  const tLogin = useTranslations("login");
  const tErrors = useTranslations("errors");
  const { locale } = useParams() as { locale: string };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(tLogin("success"));
      router.push(`/${locale}`);
    } catch (err: any) {
      // Use the generic loginFailed error message and include original error message
      setError(
        tErrors("loginFailed", { message: err.message || tErrors("unknown") })
      );
    }
  };

  return (
    <div className="bg-black flex flex-col md:flex-row w-full min-h-screen">
      {/* LEFT: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 bg-black">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl font-extrabold text-white">
            {tLogin("title")}
          </h1>
          <p className="text-gray-300">{tLogin("description")}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 text-white">
                {tLogin("emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={tLogin("emailPlaceholder")}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-white">
                {tLogin("passwordLabel")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={tLogin("passwordPlaceholder")}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg"
            >
              {tLogin("button")}
            </button>
          </form>

          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <p className="text-center text-gray-500">
            {tLogin("noAccount")}{" "}
            <Link
              href={`/${locale}/signup`}
              className="text-yellow-400 hover:underline"
            >
              {tLogin("signUp")}
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Slider */}
      <AuthSlider
        title={tLogin("title")}
        subtitle={tLogin("description")}
        emoji="🎬"
      />
    </div>
  );
}
