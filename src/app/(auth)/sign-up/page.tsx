import { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "@/features/Auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Nexux - Build your Network",
  description: "Nexux is a survey platform built on top of Appwrite.",
};

export default function SignUpPage() {
  return (
    <main className="container flex justify-center items-center h-screen">
      <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center justify-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <SignUpForm />
        <div className="text-sm flex gap-1 justify-center">
          <p>Already have an account? </p>
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
