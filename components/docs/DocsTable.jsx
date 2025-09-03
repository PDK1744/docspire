"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { File, Trash2, Pencil } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SearchCommand } from "../search-command";
import { useState, useEffect } from "react";
import { DeleteDocumentDialog } from "../delete-document-dialog";

export default function DocumentsPage({ companyId }) {
  const [showDeleteDialogOpen, setShowDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [role, setRole] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserRole() {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select("company_id, role")
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        return;
      }

      setRole(membership.role);
    }
    fetchUserRole();
  }, [companyId]);

  const fetchDocuments = async (companyId) => {
    const res = await fetch(`/api/docs/${companyId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch documents");
    }
    return res.json();
  };

  const {
    data: documents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents", companyId],
    queryFn: () => fetchDocuments(companyId),
    enabled: !!companyId,
  });

  const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-content">All Documents</h1>
        <p className="text-base-content/60">
          Browse all documents in your company across collections.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 max-w-md">
        <SearchCommand companyId={companyId} />
      </div>

      {/* Loading & error states */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <span className="ml-2 text-base-content/70">
            Loading documents...
          </span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error fetching documents</span>
        </div>
      )}

      {!isLoading && documents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-base-content/70">
            No documents found. Start by creating a new document!
          </p>
        </div>
      )}

      {/* Documents table */}
      {documents && documents.length > 0 && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="border-base-300">
                    <th className="w-[40%] text-base-content font-semibold">
                      Title
                    </th>
                    <th className="text-base-content font-semibold">
                      Collection
                    </th>
                    <th className="text-base-content font-semibold">
                      Last Updated
                    </th>
                    <th className="text-base-content font-semibold">
                      Last Updated By
                    </th>
                    {role === "admin" && (
                      <th className="text-right text-base-content font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-base-300"
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-base-content/40" />
                          <Link href={`/dashboard/documents/${doc.id}`}>
                            <span className="font-medium text-primary hover:text-primary-focus cursor-pointer hover:underline">
                              {doc.title}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="text-base-content">
                        {doc.document_collections?.name || "N/A"}
                      </td>
                      <td className="text-base-content">
                        {formatExpireDate(doc.updated_at)}
                      </td>
                      <td className="text-base-content">
                        {doc.last_updated_by}
                      </td>
                      {role === "admin" && (
                        <td>
                          <div className="flex justify-end gap-1">
                            <button
                              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" color="red" />
                            </button>
                            <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-info hover:bg-info/10">
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialogOpen && selectedDocument && (
        <DeleteDocumentDialog
          isOpen={showDeleteDialogOpen}
          onClose={() => setShowDeleteDialogOpen(false)}
          document={selectedDocument}
          companyId={companyId}
        />
      )}
    </div>
  );
}
