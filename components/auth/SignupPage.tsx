"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { ErrorMessage, SuccessMessage } from "@/constants/strings";
import { useAuthActions } from "./useAuthAction";

export default function SignupPage() {
  const t = useTranslations("signup");
  const tErrors = useTranslations("errors");
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle } = useAuthActions();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const form = e.currentTarget;
    const name = (form.username as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirm_password as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError(tErrors("passwordMismatch"));
      setIsLoading(false);
      return;
    }

    try {
      await signupWithEmail(name, email, password);
      setSuccess("Successfully registered! 🎉");
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(err?.message || tErrors("signupFailed"));
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
      const key = err.code
        ?.replace("auth/", "")
        .split("-")
        .map((part: string, i: number) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
        .join("");
      setError(tErrors(key) || tErrors("unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout sliderTitle={t("title")} sliderSubtitle={t("description")} sliderEmoji="😊">
      <AuthForm
        title={t("title")}
        description={t("description")}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText={t("button")}
      >
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
          <label htmlFor="confirm_password" className="block mb-1 text-white">
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
      </AuthForm>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {/* Divider */}
      <div className="flex items-center space-x-2 my-4">
        <hr className="flex-grow border-gray-600" />
        <span className="text-gray-400 uppercase text-xs">{t("orContinueWith")}</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Google Sign-in */}
      <div className="flex justify-center space-x-4">
        <GoogleSignInButton onClick={handleGoogle} disabled={isLoading} />
      </div>

      <p className="text-center text-gray-500 text-sm">
        {t("haveAccount")}{" "}
        <Link href={`/${locale}/login`} className="text-yellow-400 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </AuthLayout>
  );
}
