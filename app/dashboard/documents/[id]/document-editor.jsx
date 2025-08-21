"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@/components/document-editor/Editor";

export default function DocumentEditor({ documentId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const editorRef = useRef();
  const supabase = createClient();

  useEffect(() => {
    async function loadDocument() {
      try {
        const { data: doc, error } = await supabase
          .from("documents")
          .select("*, document_collections(name)")
          .eq("id", documentId)
          .single();

        if (error) {
          console.error("Error loading document:", error);
          return;
        }

        if (doc) {
          setDocument(doc);
          setContent(doc.content || {});
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [documentId, supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const content = await editorRef.current.save();

      const plainText = extractPlainText(content);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You must be logged in to save documents."
        });
        return;
      }

      const { error } = await supabase
        .from("documents")
        .update({
          content: content,
          plain_text: plainText,
          updated_at: new Date().toISOString(),
          last_updated_by: user.user_metadata.display_name
        })
        .eq("id", documentId);

      if (error) {
        console.error("Error saving document:", error);
        toast({
          variant: "destructive",
          title: "Error saving document",
          description: "Please try again later."
        });
      } else {
        toast({
          title: "Document saved",
          description: "Your changes have been saved successfully."
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error saving document",
        description: "Please try again later."
      });
    } finally {
      setSaving(false);
    }
  };

  function extractPlainText(content) {
    if (!content?.blocks) return "";
    return content.blocks
      .map((block) => {
        switch (block.type) {
          case "paragraph":
          case "header":
            return block.data.text.replace(/<[^>]+>/g, ''); // Strip HTML tags
          case "list":
            return block.data.items.join(" ");
          default:
            return "";
        }
      })
      .join("\n");
  }



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="w-full px-4 lg:px-20 py-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{document.title}</h1>
          {document.document_collections?.name && (
            <p className="text-sm text-zinc-500 mt-1">
              Collection: <span className="font-medium">{document.document_collections.name}</span>
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <Editor
          ref={editorRef}
          data={content}
          onChange={setHtmlContent}
          editorBlock="editorjs-container"
          className="w-full"
        />
      </div>
    </div>
  );
}
