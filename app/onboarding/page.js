"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { createCompanyAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  //   const supabase = createClient()

  const handleJoinCompany = async (code) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/company/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to join company");
      }
      // const data = await res.json();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("An error occurred while joining the company.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

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
              {step === 1
                ? "Get Started"
                : choice === "create"
                ? "Create Company"
                : "Join Company"}
            </h2>
            <p className="text-center text-base-content/70 text-sm">
              {step === 1
                ? "Are you creating a new company or joining an existing one?"
                : choice === "create"
                ? "Give your company a name to get started."
                : "Enter your company’s invite code to join."}
            </p>
          </div>

          {/* Step 1 - Choose path */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <button
                className={`btn ${
                  choice === "create" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setChoice("create")}
              >
                Create a New Company
              </button>
              <button
                className={`btn ${
                  choice === "join" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setChoice("join")}
              >
                Join an Existing Company
              </button>
              <button
                onClick={handleNext}
                disabled={!choice}
                className="btn btn-primary mt-2 w-full"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 - Create company */}
          {step === 2 && choice === "create" && (
            <form action={createCompanyAction} className="space-y-3">
              <div className="form-control">
                <label className="label" htmlFor="companyName">
                  <span className="label-text">Company Name</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Create Company
              </button>
            </form>
          )}

          {/* Step 2 - Join company */}
          {step === 2 && choice === "join" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const code = formData.get("companyCode").toUpperCase();
                await handleJoinCompany(code);
              }}
              className="space-y-3"
            >
              <div className="form-control">
                <label className="label" htmlFor="companyCode">
                  <span className="label-text">Company Code</span>
                </label>
                <input
                  id="companyCode"
                  name="companyCode"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {error && <p className="text-error text-sm mt-1">{error}</p>}
              <button type="submit" className="btn btn-primary w-full">
                {loading ? "Joining..." : "Join Company"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="pt-4 text-sm text-center text-base-content/70">
            Need help?{" "}
            <Link
              href="/support"
              className="text-primary font-medium hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
