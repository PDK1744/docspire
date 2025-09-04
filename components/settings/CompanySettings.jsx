"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Key,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Account from "../subscription-plans/account/account";

export default function CompanySettings({ companyId }) {
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinCodeExpiration, setJoinCodeExpiration] = useState(null);
  const [joinLoading, setjoinLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const res = await fetch("/api/settings/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ companyName }),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error("Error updating company:", errData);
        setError("Failed to update company settings. Please try again.");
      } else {
        setSuccess("Company settings updated successfully!");
      }
    } catch (err) {
      console.error("Error updating company:", err.message);
      setError("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    async function fetchJoinCode() {
      setjoinLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/company/${companyId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch join code");
        const data = await res.json();
        console.log(data);
        setJoinCode(data.joinCode || null);
        setCompanyName(data.companyName || null);
        setJoinCodeExpiration(data.joinCodeExpiresAt || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setjoinLoading(false);
      }
    }
    if (companyId) fetchJoinCode();
  }, [companyId]);

  async function generateJoinCode() {
    setjoinLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/company/join-code", {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate join code");
      }
      const data = await res.json();
      setJoinCode(data.joinCode);
      setJoinCodeExpiration(data.joinCodeExpiresAt || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setjoinLoading(false);
    }
  }

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
      }
    };
    verifyUser();
  }, [supabase]);

  if (!user) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">
              Loading company settings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      {/* Header */}
      <div className="card-body pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Building2 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="card-title text-lg font-semibold ">Company Settings</h2>
            <p className="text-sm text-white-500">
              Manage your organization settings and team access
            </p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-8">
        {/* Status Messages */}
        {success && (
          <div className="alert alert-success">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <h3 className="text-lg font-semibold">Company Information</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="label">
                <span className="label-text">Company Name</span>
              </label>
              <input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-end">
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

        {/* Team Management */}
        <div className="pt-6 border-t space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <h3 className="text-lg font-semibold">Team Management</h3>
          </div>

          <div className="bg-base-200 rounded-lg p-4 space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-white-600">Invite New Members</span>
              </label>
              <p className="text-sm text-white-500 mb-3">
                Generate a join code for new team members to join your company
              </p>

              <button
                onClick={generateJoinCode}
                disabled={joinLoading}
                className="btn btn-sm btn-primary hover:bg-success hover:text-success-content shadow-sm"
              >
                {joinLoading ? "Generating..." : "Generate New Join Code"}
              </button>
            </div>

            {joinCode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Current Join Code</span>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <code className="text-lg font-mono text-blue-700 bg-blue-50 px-3 py-2 rounded">
                        {joinCode}
                      </code>
                      <div className="text-sm text-gray-500 mt-2">
                        {joinCodeExpiration
                          ? `Expires: ${formatExpireDate(joinCodeExpiration)}`
                          : "No expiration set"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="btn btn-outline btn-sm"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
