"use client";
import React from "react";
import Spinner from "./Spinner";

type AuthFormProps = {
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  children: React.ReactNode;
  buttonText: string;
};

export default function AuthForm({
  title,
  description,
  onSubmit,
  isLoading,
  children,
  buttonText,
}: AuthFormProps) {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-white">{title}</h1>
      <p className="text-lg text-gray-300">{description}</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center relative"
        >
          {isLoading ? <Spinner /> : buttonText}
        </button>
      </form>
    </>
  );
}
