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
    return documents;
  };

  const { data: documents = [], isLoading, isError } = useQuery({
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
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-x-2 w-[400px] text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 transition-colors"
      >
        <Search className="h-4 w-4 text-gray-500" />
        <span className="flex-1 text-left">Search documents...</span>
      </button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="sr-only">
          <DialogTitle>Search Documents</DialogTitle>
        </div>
        <Command key={`${submittedTerm}-${documents.length}-${isLoading}`}>
          <CommandInput
            placeholder="Press Enter to search..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            onKeyDown={handleInputKeyDown}
          />
          <CommandList>
          <CommandEmpty>
            {isLoading
              ? "Searching..."
              : submittedTerm.length === 0
                ? "Type some words to search"
                : !isLoading && submittedTerm.length > 0 && documents.length === 0
                  ? "No results found"
                  : null}
          </CommandEmpty>
          {!isLoading && documents.length > 0 && (
            <CommandGroup>
              {documents.map((doc) => (
                <div key={doc.id} className="relative">
                  <CommandItem className="opacity-100">
                    <Link 
                      href={`/dashboard/documents/${doc.id}`}
                      className="flex items-center gap-x-2 w-full text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer absolute inset-0 px-2 py-1.5 z-10"
                      onClick={() => setIsOpen(false)}
                    >
                      <File className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-blue-600 hover:text-blue-800">
                          {doc.title}
                        </div>
                        {doc.collection_name && (
                          <div className="text-xs text-muted-foreground">
                            in {doc.collection_name}
                          </div>
                        )}
                      </div>
                    </Link>
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          )}
                  </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}