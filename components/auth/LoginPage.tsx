"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuthActions } from "./useAuthAction";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { ErrorMessage, SuccessMessage } from "@/constants/strings";
import { GoogleSignInButton } from "./GoogleSignInButton";

export default function LoginPage() {
  const tLogin = useTranslations("login");
  const tErrors = useTranslations("errors");
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuthActions();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      await loginWithEmail(email, password);
      setSuccess(tLogin("success"));
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(
        tErrors("loginFailed", { message: err.message || tErrors("unknown") })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await loginWithGoogle();
      router.push(`/${locale}`);
    } catch (err: any) {
      const key = (err.code as string)
        .replace("auth/", "")
        .split("-")
        .map((part, i) =>
          i === 0 ? part : part[0].toUpperCase() + part.slice(1)
        )
        .join("");

      setError(tErrors(key) || tErrors("unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      sliderTitle={tLogin("title")}
      sliderSubtitle={tLogin("description")}
      sliderEmoji="🎬"
    >
      <AuthForm
        title={tLogin("title")}
        description={tLogin("description")}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText={tLogin("button")}
      >
        {/* Email */}
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

        {/* Password */}
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
      </AuthForm>

      <ErrorMessage message={error} />
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

      {/* Divider */}
      <div className="flex items-center space-x-2 my-4">
        <hr className="flex-grow border-gray-600" />
        <span className="text-gray-400 uppercase text-xs">
          {tLogin("orContinueWith")}
        </span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Google Login */}
      <div className="flex justify-center space-x-4">
        <GoogleSignInButton onClick={handleGoogle} disabled={isLoading} />
      </div>

      <SuccessMessage message={success} />

      <p className="text-center text-gray-500">
        {tLogin("noAccount")}{" "}
        <Link
          href={`/${locale}/signup`}
          className="text-yellow-400 hover:underline"
        >
          {tLogin("signUp")}
        </Link>
      </p>
    </AuthLayout>
  );
}
