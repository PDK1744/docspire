import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { de } from "zod/v4/locales/index.cjs";

export function DeleteDocumentDialog({ isOpen, onClose, document, companyId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const queryClient = useQueryClient();
  // const handleDelete = async (documentId) => {
  //     try {
  //         const response = await fetch(`/api/docs/${companyId}/${document.id}`, {
  //             method: 'DELETE',
  //         });
  //         if (!response.ok) {
  //             throw new Error('Failed to delete document');
  //         }
  //         return response.json();
  //     } catch (error) {
  //         console.error('Error deleting document:', error);
  //     }
  // }

  const deleteDocMutation = useMutation({
    mutationFn: async (documentId) => {
      const response = await fetch(`/api/docs/${companyId}/${documentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSuccess("Document deleted successfully");
      setError(null);
    //   setTimeout(() => {
    //     onClose();
    //     setSuccess("");
    //   }, 5000);
    },
    onError: (error) => {
      setError(error.message);
      setSuccess(null);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Document: {document.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!success && (
            <Alert variant="destructive">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>This action cannot be undone.</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-center space-y-3">
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">Error: {error}</p>}
        </div>

        <DialogFooter>
          {success ? (
            // Show only OK button after success
            <Button variant="defaultGreen" onClick={onClose}>
              OK
            </Button>
          ) : (
            // Show Cancel and Delete buttons before success
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDocMutation.mutate(document.id)}
                disabled={deleteDocMutation.isPending}
              >
                {deleteDocMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
