"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { File, Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function DocumentsPage() {
    const supabase = createClient()
    const { data: user, error: userError } = supabase.auth.getUser()
    const { data: membership, error: membershipError } = supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", user?.id)
        .single()
    
    const fetchDocuments = async (membership.company_id) => {
        const res = await fetch("/api/documents", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        })
    }
    

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Documents</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse all documents in your company across collections.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 max-w-md">
        <Input placeholder="Search documents..." />
        <Button>Search</Button>
      </div>

      {/* Documents table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                      {doc.title}
                    </span>
                  </TableCell>
                  <TableCell>{doc.collection}</TableCell>
                  <TableCell>{doc.owner}</TableCell>
                  <TableCell>{doc.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
