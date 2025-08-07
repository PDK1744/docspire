"use client";

import { useState, useCallback } from "react";
import { Search, File, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
import { cn } from "@/lib/utils";

export function SearchCommand() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const runSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    try {
      // Get user's company first
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: companyData } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", userData.user.id)
        .single();

      if (!companyData?.company_id) return;

      // Search documents with content
      const query = searchQuery.trim();
      
      const { data: docs, error } = await supabase
        .from("documents")
        .select(`
          id,
          title,
          document_collections (
            name
          )
        `)
        .eq("company_id", companyData.company_id)
        .textSearch('title', `${query}`)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Search error:", error);
        return;
      }

      setDocuments(docs || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    
    if ('title' in item) {
      // It's a document
      router.push(`/dashboard/documents/${item.id}`);
    } else {
      // It's a collection - you might want to implement collection navigation
      // For now, we'll just close the dialog
      setIsOpen(false);
    }
  };

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
          <DialogTitle>Search Documents and Collections</DialogTitle>
        </div>
        <CommandInput
          placeholder="Type words to search and press Enter..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runSearch(query);
            }
          }}
        />
        <CommandList>
          <CommandEmpty>Type some words and press Enter to search</CommandEmpty>
          {loading ? (
            <div className="py-6 text-center text-sm">Searching...</div>
          ) : (
            <>
              {documents.length > 0 && (
                <CommandGroup>
                  {documents.map((document) => (
                    <CommandItem
                      key={document.id}
                      onSelect={() => handleSelect(document)}
                      className="flex items-center gap-x-2"
                    >
                      <File className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{document.title}</div>
                        {document.document_collections?.name && (
                          <div className="text-xs text-gray-500">
                            in {document.document_collections.name}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
