"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ProfileSettings({ user, onSave}) {
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ name, email})
    }

    return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button variant="defaultGreen" type="submit">Save</Button>
      </form>
    </div>
  )
}