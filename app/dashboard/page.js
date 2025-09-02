"use client";

import { DocumentTile } from "@/components/document-tile";
import { CollectionDialog } from "@/components/collection-dialog";
import { DocumentDialog } from "@/components/document-dialog";
import { FilePlus, Layout, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadCollections() {
      try {
        // Get the current user's company
        const { data: userData, error: userError } = await supabase.auth.getUser();
        console.log('User data:', userData);
        if (userError) {
          console.error('User error:', userError);
          return;
        }
        if (!userData?.user) return;

        const { data: companyData, error: companyError } = await supabase
          .from("company_members")
          .select("company_id, role")
          .eq("user_id", userData.user.id)
          .single();

        setIsAdmin(companyData?.role === 'admin');
        console.log('Company data:', companyData);
        if (companyError) {
          console.error('Company error:', companyError);
          return;
        }
        if (!companyData?.company_id) return;

        // Get collections for the company
        const { data: collectionsData, error: collectionsError } = await supabase
          .from("document_collections")
          .select(`
            *,
            documents:documents(*)
          `)
          .eq("company_id", companyData.company_id)
          .order("display_order");
        
        console.log('Collections data:', collectionsData);
        if (collectionsError) {
          console.error('Collections error:', collectionsError);
          return;
        }

        if (collectionsData) {
          setCollections(collectionsData);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCollections();

    // Subscribe to changes in collections
    const channel = supabase
      .channel("document_collections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "document_collections"
        },
        loadCollections
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleCreateCollection = async (formData) => {
    console.log('Creating collection with data:', formData);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('User data:', userData);
    if (userError) {
      console.error('User error:', userError);
      return;
    }

    const { data: companyData, error: companyError } = await supabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", userData.user.id)
      .single();
    
    if (companyError) {
      console.error('Company error:', companyError);
      return;
    }

    const { data, error } = await supabase.from("document_collections").insert({
      name: formData.name,
      description: formData.description,
      company_id: companyData.company_id,
      created_by: userData.user.id,
    }).select();
    console.log('Insert result:', data);
    if (error) {
      console.error('Insert error:', error);
      return;
    }
    
    if (data) {
      setCollections([...collections, { ...data[0], documents: [] }]);
    }
  };

  const handleEditCollection = async (id, formData) => {
    const { data, error } = await supabase
      .from("document_collections")
      .update({
        name: formData.name,
        description: formData.description,
      })
      .eq("id", id)
      .select();

    if (!error && data) {
      setCollections(
        collections.map((collection) =>
          collection.id === id
            ? { ...collection, ...data[0] }
            : collection
        )
      );
    }
  };

  const handleCreateDocument = async (formData, collectionName) => {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Get user's company
      const { data: companyData } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", userData.user.id)
        .single();

      if (!companyData?.company_id) return;

      // Create the document
      const { data: doc, error } = await supabase
        .from("documents")
        .insert({
          title: formData.title,
          collection_id: formData.collectionId,
          company_id: companyData.company_id,
          created_by: userData.user.id,
          content: { text: "" },
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating document:", error.message);
        return;
      }

      // Navigate to the new document
      router.push(`/dashboard/documents/${doc.id}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteCollection = async (id, deleteDocuments = false) => {
    try {
      // First check if user is admin
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: memberData, error: memberError } = await supabase
        .from("company_members")
        .select("role, company_id")
        .eq("user_id", userData.user.id)
        .single();

      if (memberError || memberData?.role !== 'admin') {
        console.error('Only admins can delete collections');
        return;
      }

      if (deleteDocuments) {
        // Delete documents first if requested
        const { error: docDeleteError } = await supabase
          .from("documents")
          .delete()
          .eq("collection_id", id);

        if (docDeleteError) {
          console.error('Error deleting documents:', docDeleteError);
          return;
        }
      }

      // Delete the collection
      const { error: deleteError } = await supabase
        .from("document_collections")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error('Error deleting collection:', deleteError);
        return;
      }

      // Update the UI
      setCollections(collections.filter(collection => collection.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-base-content">Documents</h1>
        <div className="flex gap-3">
          {isAdmin && (
            <CollectionDialog
              trigger={
                <button className="btn btn-primary gap-2">
                  <Layout className="h-4 w-4" />
                  New Collection
                </button>
              }
              onSubmit={handleCreateCollection}
            />
          )}
          <button 
            className="btn btn-success gap-2"
            onClick={() => setShowNewDocumentDialog(true)}
          >
            <FilePlus className="h-4 w-4" />
            New Document
          </button>
          <DocumentDialog
            isOpen={showNewDocumentDialog}
            onClose={() => setShowNewDocumentDialog(false)}
            onSubmit={handleCreateDocument}
            collections={collections}
          />
        </div>
      </div>

      {/* Content section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-100 shadow-xl h-[250px]">
              <div className="card-body">
                <div className="skeleton h-6 w-3/4 mb-4"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <DocumentTile
              key={collection.id}
              collection={collection}
              documents={collection.documents}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onCreateDocument={handleCreateDocument}
              isAdmin={isAdmin}
            />
          ))}
          {/* Add Collection Tile */}
          {isAdmin && (
            <CollectionDialog
              trigger={
                <div className="card bg-base-100 shadow-xl border-2 border-dashed border-base-300 hover:border-primary hover:shadow-lg transition-all duration-200 h-[250px] cursor-pointer group">
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <Plus className="h-8 w-8 text-base-content/40 group-hover:text-primary transition-colors duration-200 mb-2" />
                    <p className="text-sm font-medium text-base-content/60 group-hover:text-primary transition-colors duration-200">
                      Create New Collection
                    </p>
                  </div>
                </div>
              }
              onSubmit={handleCreateCollection}
            />
          )}
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <Layout className="h-12 w-12 text-base-content/40 mb-4" />
            <h3 className="card-title text-base-content mb-2">
              No document collections
            </h3>
            <p className="text-base-content/70 mb-6">
              Get started by creating a new collection to organize your documents.
            </p>
            <CollectionDialog
              trigger={
                <button className="btn btn-primary gap-2">
                  <Layout className="h-4 w-4" />
                  New Collection
                </button>
              }
              onSubmit={handleCreateCollection}
            />
          </div>
        </div>
      )}
    </div>
  );
}