"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Building2, Users, CheckCircle, AlertCircle, Key } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function CompanySettings({ companyId }) {
  const [user, setUser] = useState(null)
  const [companyName, setCompanyName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [joinCodeExpiration, setJoinCodeExpiration] = useState(null)
  const [joinLoading, setjoinLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const supabase = createClient()

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
          "Accept": "application/json"
        },
        body: JSON.stringify({ companyName })
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
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    async function fetchJoinCode() {
      setjoinLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/company/${companyId}`, {
          credentials: "include"
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
  }, [success])

  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data?.user) {
        setUser(data.user)
      }
    }
    verifyUser()
  }, [supabase])

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-500">Loading company settings...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <Card className="border-slate-200/60 shadow-sm bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Building2 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-800">Company Settings</CardTitle>
            <CardDescription className="text-slate-600">
              Manage your organization settings and team access
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Status Messages */}
        {success && (
          <Alert className="border-green-200 bg-green-50/50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="border-red-200 bg-red-50/50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Company Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-800">Company Information</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                Company Name
              </Label>
              <Input 
                id="companyName" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Enter company name"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Team Management Section */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-800">Team Management</h3>
          </div>
          
          <div className="bg-slate-50/50 rounded-lg p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Invite New Members
              </Label>
              <p className="text-sm text-slate-600 mb-3">
                Generate a join code for new team members to join your company
              </p>
              
              <Button 
                onClick={generateJoinCode} 
                disabled={joinLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                {joinLoading ? "Generating..." : "Generate New Join Code"}
              </Button>
            </div>
            
            {joinCode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Current Join Code</span>
                </div>
                
                <div className="bg-white border border-blue-200/70 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <code className="text-lg font-mono text-blue-700 bg-blue-50 px-3 py-2 rounded font-semibold">
                        {joinCode}
                      </code>
                      <div className="text-sm text-slate-600 mt-2">
                        {joinCodeExpiration
                          ? `Expires: ${formatExpireDate(joinCodeExpiration)}`
                          : "No expiration set"}
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="ml-3 border-blue-200 hover:bg-blue-50"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}