"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function CollectionDialog({ 
  trigger, 
  collection = null, 
  onSubmit 
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger element */}
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>

      {/* Modal */}
      <div className={`modal ${open ? 'modal-open' : ''}`}>
        <div className="modal-box w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-base-content">
              {collection ? "Edit Collection" : "Create Collection"}
            </h3>
            <p className="text-sm text-base-content/70 mt-1">
              {collection
                ? "Make changes to your collection here."
                : "Create a new collection to organize your documents."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text">Name</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Getting Started"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text">Description</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Essential onboarding documents and guides"
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost hover:btn-error"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary hover:btn-success" disabled={!formData.name.trim()}>
                {collection ? "Save Changes" : "Create Collection"}
              </button>
            </div>
          </form>
        </div>

        {/* Modal backdrop - clicking outside closes modal */}
        <div className="modal-backdrop" onClick={() => setOpen(false)}></div>
      </div>
    </>
  );
}
