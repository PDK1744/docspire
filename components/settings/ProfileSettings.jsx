"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

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
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-500">Loading profile...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="border-slate-200/60 shadow-sm bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-800">Profile Settings</CardTitle>
            <CardDescription className="text-slate-600">
              Update your personal account information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
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
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Display Name
              </Label>
              <Input 
                id="name" 
                value={userName} 
                onChange={(e) => setuserName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                disabled
                id="email" 
                type="email" 
                value={userEmail} 
                onChange={(e) => setuserEmail(e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}