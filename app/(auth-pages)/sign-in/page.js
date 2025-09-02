"use server";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import StatusMessage from "@/components/status-message";
import { SignInButton } from "@/components/signin-button";

export default async function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <Link href="/" className="text-xl font-bold">
                DocSpire
              </Link>
            </div>
            <h2 className="card-title text-2xl">Welcome back</h2>
            <p className="text-sm opacity-70 text-center">
              Enter your email and password to sign in to your account
            </p>
            <StatusMessage />
          </div>

          {/* Form */}
          <form action={signInAction} className="form-control gap-4 mt-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                className="input w-full"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input w-full"
                required
                autoComplete="current-password"
              />
            </div>

            
            <SignInButton />
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="link link-primary"
            >
              Forgot your password?
            </Link>
            <div className="mt-2 opacity-70">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="link link-primary font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
