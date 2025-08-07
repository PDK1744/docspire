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
  documentCount 
}) {
  const [deleteOption, setDeleteOption] = useState("collection-only");

  const handleDelete = () => {
    onConfirm(deleteOption === "delete-all");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Collection: {collectionName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {documentCount > 0 && (
            <p className="text-sm text-gray-500">
              This collection contains {documentCount} document{documentCount === 1 ? '' : 's'}.
            </p>
          )}
          <RadioGroup
            defaultValue="collection-only"
            onValueChange={setDeleteOption}
            className="grid gap-4"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="collection-only" id="collection-only" />
              <Label htmlFor="collection-only" className="font-normal leading-tight">
                Delete collection only
                <span className="block text-sm text-gray-500 mt-1">
                  Documents will be uncategorized but not deleted
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="delete-all" id="delete-all" />
              <Label htmlFor="delete-all" className="font-normal leading-tight">
                Delete collection and documents
                <span className="block text-sm text-gray-500 mt-1">
                  This will permanently delete all documents in this collection
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
