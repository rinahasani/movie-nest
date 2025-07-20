"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ← your initialized Firebase client
import Link from "next/link";
import { AuthSlider } from "@/components/AuthSlider";

export default function ForgotPasswordPage() {
  const t = useTranslations("resetPassword");
  const tErrors = useTranslations("errors");
  const { locale } = useParams() as { locale: string };
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("sent");
    } catch (err: any) {
      console.error(err);
      setError(err.message || tErrors("unknown"));
      setStatus("error");
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold text-white">
            {t("title" /* e.g. "Mot de passe oublié ?" */)}
          </h1>
          <p className="text-lg text-gray-300">{t("description")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-white">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
              {status === "sending"
                ? t("sendingButton")
                : t("button" /* e.g. "Réinitialiser le mot de passe" */)}
            </button>
          </form>

          {status === "sent" && (
            <p className="text-green-400">{t("emailSentMessage")}</p>
          )}
          {status === "error" && <p className="text-red-400">{error}</p>}

          <p className="text-center text-gray-500">
            <Link
              href={`/${locale}/login`}
              className="text-yellow-400 hover:underline"
            >
              {t("backToLogin" /* e.g. "Retour à la connexion" */)}
            </Link>
          </p>
        </div>
      </div>

      <AuthSlider
        title={t("sliderTitle" /* whatever you want */)}
        subtitle={t("sliderSubtitle")}
        emoji="🔒"
      />
    </div>
  );
}
