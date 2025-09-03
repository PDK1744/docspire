"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [userName, setuserName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ userName, userEmail }),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error("Error updating profile:", errData);
        setError("Failed to update profile. Please try again.");
      } else {
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
        setuserName(data.user.user_metadata?.display_name || "");
        setuserEmail(data.user.email || "");
      }
    };
    verifyUser();
  }, [supabase]);

  if (!user) {
    return (
      <div className="card bg-base-100 shadow-sm border border-slate-200/60">
        <div className="card-body p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-500">
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      {/* Header */}
      <div className="card-body pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="card-title text-lg font-semibold">
              Profile Settings
            </h2>
            <p className="text-white-500 text-sm">
              Update your personal account information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card-body space-y-6">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success bg-green-50/50 border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error bg-red-50/50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Display Name */}
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text font-medium text-white-600 text-sm">
                  Display Name
                </span>
              </label>
              <input
                id="name"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                className="input input-bordered w-full border-slate-200 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                placeholder="Enter your display name"
              />
            </div>

            {/* Email Address */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium text-white-600 text-sm">
                  Email Address
                </span>
              </label>
              <input
                disabled
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
                className="input input-bordered w-full border-slate-200 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-sm btn-primary hover:bg-success hover:text-success-content shadow-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
