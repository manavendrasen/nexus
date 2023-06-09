import { Metadata } from "next";

import { ConfirmVerificationEmailForm } from "@/features/Auth/ConfirmEmailVerificationForm";

export const metadata: Metadata = {
  title: "Confirm Email | Nexus - Build your Network",
  description: "Nexus is a survey platform built on top of Appwrite.",
};

export default function ConfirmVerificationEmailPage() {
  return (
    <main className="container flex justify-center items-center h-screen">
      <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center justify-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Email
          </h1>
          <p className="text-sm text-muted-foreground">
            Verify your email address to continue
          </p>
        </div>
        <ConfirmVerificationEmailForm />
      </div>
    </main>
  );
}
