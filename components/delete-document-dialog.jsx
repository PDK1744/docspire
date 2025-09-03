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
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-base-content">
            Delete Document: {document.title}
          </h3>
        </div>

        <div className="space-y-4">
          {!success && (
            <div className="alert alert-warning">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.876a2 2 0 001.789-2.894l-6.938-13.876a2 2 0 00-3.578 0L1.283 18.106a2 2 0 001.789 2.894z"
                />
              </svg>
              <div>
                <div className="font-semibold">Warning</div>
                <div className="text-sm">This action cannot be undone.</div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* Error Message */}
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
              <span>Error: {error}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-action mt-6">
          {success ? (
            // Show only OK button after success
            <button className="btn btn-success" onClick={onClose}>
              OK
            </button>
          ) : (
            // Show Cancel and Delete buttons before success
            <>
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => deleteDocMutation.mutate(document.id)}
                disabled={deleteDocMutation.isPending}
              >
                {deleteDocMutation.isPending && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                {deleteDocMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
