"use client";
import { useState, useEffect } from "react";
import { Search, File } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";

export function SearchCommand({ companyId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const router = useRouter();

  // React Query fetch function
  const fetchDocuments = async (query) => {
    if (!query || query.trim().length === 0) return [];
    const res = await fetch(
      `/api/docs/${companyId}/search?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Search request failed");
    const documents = await res.json();
    if (!documents || !Array.isArray(documents)) {
      return [];
    }
    return documents;
  };

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", companyId, submittedTerm],
    queryFn: () => fetchDocuments(submittedTerm),
    enabled: submittedTerm.length > 0,
    staleTime: 0, // Ensure fresh data
    gcTime: 0, // Previously cacheTime, disable caching
  });

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setSubmittedTerm(searchTerm);
      // Remove the manual refetch call since query will auto-refetch when submittedTerm changes
    }
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    router.push(`/dashboard/documents/${item.id}`);
  };

  // Reset search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSubmittedTerm("");
    }
  }, [isOpen]);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-x-2 w-[400px] text-sm font-medium text-base-content bg-base-100 rounded-lg border border-base-300 px-4 py-2 hover:bg-base-200 transition-colors"
      >
        <Search className="h-4 w-4 text-base-content/50" />
        <span className="flex-1 text-left">Search documents...</span>
      </button>

      {/* Search Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-full max-w-2xl p-0 bg-base-100">
          {/* Screen reader title */}
          <h2 className="sr-only">Search Documents</h2>

          {/* Search Input */}
          <div className="border-b border-base-300">
            <div className="flex items-center px-4 py-3">
              <Search className="h-4 w-4 text-base-content/50 mr-3" />
              <input
                type="text"
                placeholder="Press Enter to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent text-base-content placeholder:text-base-content/50 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {/* Empty State */}
            {(isLoading ||
              submittedTerm.length === 0 ||
              (!isLoading &&
                submittedTerm.length > 0 &&
                documents.length === 0)) && (
              <div className="px-4 py-8 text-center text-base-content/60">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Searching...</span>
                  </div>
                ) : submittedTerm.length === 0 ? (
                  "Type some words to search"
                ) : (
                  "No results found"
                )}
              </div>
            )}

            {/* Results List */}
            {!isLoading && documents.length > 0 && (
              <div className="py-2">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/documents/${doc.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-x-3 w-full px-4 py-3 hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    <File className="h-4 w-4 text-base-content/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-primary hover:text-primary-focus truncate">
                        {doc.title}
                      </div>
                      {doc.collection_name && (
                        <div className="text-xs text-base-content/60 mt-0.5">
                          in {doc.collection_name}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Close instruction */}
          <div className="border-t border-base-300 px-4 py-2 text-xs text-base-content/50">
            Press Escape to close
          </div>
        </div>

        {/* Modal backdrop - clicking outside closes modal */}
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
      </div>
    </>
  );
}
