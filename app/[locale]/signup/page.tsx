import React, { use } from "react";
import SignupPage from "@/components/auth/SignupPage";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  return <SignupPage />;
}
