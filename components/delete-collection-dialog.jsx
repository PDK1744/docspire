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

export function DeleteCollectionDialog({
  isOpen,
  onClose,
  onConfirm,
  collectionName,
  documentCount,
}) {
  const [deleteOption, setDeleteOption] = useState("collection-only");

  const handleDelete = () => {
    onConfirm(deleteOption === "delete-all");
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-base-content">
            Delete Collection: {collectionName}
          </h3>
        </div>

        <div className="space-y-4">
          {documentCount > 0 && (
            <p className="text-sm text-base-content/60">
              This collection contains {documentCount} document
              {documentCount === 1 ? "" : "s"}.
            </p>
          )}

          {/* Radio Group */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="radio"
                  name="delete-option"
                  className="radio radio-primary"
                  value="collection-only"
                  defaultChecked
                  onChange={(e) =>
                    e.target.checked && setDeleteOption("collection-only")
                  }
                />
                <div className="label-text">
                  <div className="font-normal leading-tight text-base-content">
                    Delete collection only
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    Documents will be uncategorized but not deleted
                  </div>
                </div>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="radio"
                  name="delete-option"
                  className="radio radio-primary"
                  value="delete-all"
                  onChange={(e) =>
                    e.target.checked && setDeleteOption("delete-all")
                  }
                />
                <div className="label-text">
                  <div className="font-normal leading-tight text-base-content">
                    Delete collection and documents
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    This will permanently delete all documents in this
                    collection
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
