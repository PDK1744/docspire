"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { set } from "zod"

export default function ProfileSettings() {
  const [user, setUser] = useState(null)
  const [userName, setuserName] = useState("")
  const [userEmail, setuserEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState("")
  const supabase = createClient()





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
          "Accept": "application/json"
        },
        body: JSON.stringify({ userName, userEmail })
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error("Error updating profile:", errData);
        // throw new Error(errData.error || "Failed to update profile");
      }
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError("An error occurred while updating profile.");
    } finally {
      setLoading(false);

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
        setuserName(data.user.user_metadata?.display_name || "")
        setuserEmail(data.user.email || "")
      }
    }
    verifyUser()
  }, [supabase])

  if (!user) {
    return <div className="p-6">Loading...</div>
  }

  // TODO: Save updated profile settings. Get display name working and come back and finished updating email later.
  // TODO: Implement email validation and error handling.

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input id="name" value={userName} onChange={(e) => setuserName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input id="email" type="email" value={userEmail} onChange={(e) => setuserEmail(e.target.value)} />
        </div>
        <Button variant="defaultGreen" type="submit">{loading ? "Saving..." : "Save"}</Button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  )
}