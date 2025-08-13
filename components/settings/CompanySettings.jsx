"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"


export default function CompanySettings({ companyId }) {
  const [companyName, setCompanyName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [joinCodeExpiration, setJoinCodeExpiration] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchJoinCode() {
      setLoading(true);
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
        setLoading(false);
      }
    }
    if (companyId) fetchJoinCode();
  }, [companyId]);

  async function generateJoinCode() {
    setLoading(true);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // TODO: Handle updating Company detials/settings. Don't forget to add onSubmit to form

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Company Settings</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="mb-2">Company Name</Label>
          {/* // TODO: Save Company Settings*/}
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <Button variant="defaultGreen" type="submit">Save</Button>
      </form>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium">Invite New Members</h3>
        <Button variant="defaultGreen" onClick={generateJoinCode} disabled={loading}>
          {loading ? "Waiting..." : "Generate Join Code"}
        </Button>
        {joinCode && (
          <div className="mt-2 p-2 border-2 border-blue-200 rounded flex items-center gap-2">
            <span className="font-mono">{joinCode}</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(joinCode)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-500 hover:text-gray-800" />
            </button>
            <span className="text-sm text-muted-foreground ml-2">
              {joinCodeExpiration
                ? `Expires at: ${formatExpireDate(joinCodeExpiration)}`
                : "No expiration"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
