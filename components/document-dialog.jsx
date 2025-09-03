import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function DocumentDialog({
  isOpen,
  onClose,
  onSubmit,
  collections = [],
  defaultCollectionId = "",
}) {
  const [title, setTitle] = useState("");
  const [collectionId, setCollectionId] = useState(defaultCollectionId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      collectionId: collectionId || defaultCollectionId || null,
    });
    setTitle("");
    setCollectionId(defaultCollectionId);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-base-content">
            Create New Document
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">Document Title</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="collection">
              <span className="label-text">Collection (Optional)</span>
            </label>
            <select
              id="collection"
              value={collectionId || defaultCollectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="select select-bordered w-full"
            >
              <option disabled value="">
                Select a collection
              </option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost hover:btn-error" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary hover:btn-success"
              disabled={!title.trim()}
            >
              Create Document
            </button>
          </div>
        </form>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
