"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AuthSlider } from "@/components/AuthSlider";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const tLogin = useTranslations("login");
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
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(tLogin("success"));
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(
        tErrors("loginFailed", { message: err.message || tErrors("unknown") })
      );
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
    <div className="bg-black flex flex-col md:flex-row w-full min-h-screen">
      {/* LEFT: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 bg-black">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold text-white">
            {tLogin("title")}
          </h1>
          <p className="text-lg text-gray-300">{tLogin("description")}</p>

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
          {error && (
            <p className="text-center text-gray-500">
              <Link
                href={`/${locale}/reset-password`}
                className="text-yellow-400 hover:underline"
              >
                {tLogin("forgotPasswordLink")}
              </Link>
            </p>
          )}

          {/* Social login divider */}
          <div className="flex items-center space-x-2 my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="text-gray-400 uppercase text-xs">
              {tLogin("orContinueWith")}
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
