"use client";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import StatusMessage from "@/components/status-message";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          {/* Header */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <Link href="/" className="text-xl font-bold text-primary">
                DocSpire
              </Link>
            </div>
            <h2 className="card-title text-2xl text-center">
              Create an account
            </h2>
            <p className="text-center text-base-content/70 text-sm">
              Sign up to get started with DocSpire. If joining a company, you
              will require a company code for the next step.
            </p>
            <StatusMessage />
          </div>

          {/* Form */}
          <form action={signUpAction} className="space-y-6">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="input input-bordered w-full"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input input-bordered w-full"
                  required
                  autoComplete="new-password"
                />
                <div className="mt-2 text-xs text-base-content/70 space-y-1">
                  <p className="font-medium">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>At least 8 characters</li>
                    <li>1 uppercase letter</li>
                    <li>1 lowercase letter</li>
                    <li>1 special character</li>
                  </ul>
                </div>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input input-bordered w-full"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 text-sm text-center text-base-content/70">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
