"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { File, Trash2, Pencil } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { SearchCommand } from "../search-command"

export default function DocumentsPage({ companyId }) {
    
    
    

    const fetchDocuments = async (companyId) => {
        const res = await fetch(`/api/docs/${companyId}`)
        if (!res.ok) {
            throw new Error('Failed to fetch documents')
        }
        return res.json()
    }

    const { data: documents, isLoading, error } = useQuery({
        queryKey: ["documents", companyId],
        queryFn: () => fetchDocuments(companyId),
        enabled: !!companyId,
    })

    const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
                {/* <Input placeholder="Search documents..." />
                <Button>Search</Button> */}
                <SearchCommand companyId={companyId}/>
            </div>

            {/* Loading & error states */}
            {isLoading && <p>Loading documents...</p>}
            {error && <p className="text-red-600">Error fetching documents</p>}
            {!isLoading && documents.length === 0 && (
                <p>No documents found. Start by creating a new document!</p>)}

            {/* Documents table */}
            {documents && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Title</TableHead>
                                    <TableHead>Collection</TableHead>
                                    {/* <TableHead>Created By</TableHead> */}
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Last Updated By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="flex items-center gap-2">
                                            <File className="h-4 w-4 text-gray-400" />
                                            <Link href={`/dashboard/documents/${doc.id}`}>
                                            <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                                                {doc.title}
                                            </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>{!doc.document_collections.name ? 'N/A' : doc.document_collections.name}</TableCell>
                                        {/* <TableCell>{doc.owner}</TableCell> */}
                                        <TableCell>{formatExpireDate(doc.updated_at)}</TableCell>
                                        <TableCell>{doc.last_updated_by}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-600 hover:text-blue-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
