import React, { use } from "react";
import LoginPage from "@/components/auth/LoginPage";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  return <LoginPage />;
}
