"use client";
import React from "react";
import { AuthSlider } from "@/components/auth/AuthSlider";

type AuthLayoutProps = {
  children: React.ReactNode;
  sliderTitle: string;
  sliderSubtitle: string;
  sliderEmoji?: string;
};

export default function AuthLayout({
  children,
  sliderTitle,
  sliderSubtitle,
  sliderEmoji = "🔑",
}: AuthLayoutProps) {
  return (
    <div className="bg-black flex flex-col md:flex-row w-full min-h-screen">
      {/* LEFT: CONTENT */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>

      {/* RIGHT: SLIDER */}
      <AuthSlider title={sliderTitle} subtitle={sliderSubtitle} emoji={sliderEmoji} />
    </div>
  );
}
