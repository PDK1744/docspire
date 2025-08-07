import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { File, Plus, MoreVertical, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CollectionDialog } from "@/components/collection-dialog";
import { DeleteCollectionDialog } from "@/components/delete-collection-dialog";
import { DocumentDialog } from "@/components/document-dialog";
import { useState } from "react";

export function DocumentTile({ collection, documents = [], onEdit, onDelete, onCreateDocument, isAdmin }) {
  const { id, name, description, icon, color = "blue" } = collection;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <DocumentDialog
              isOpen={showNewDocumentDialog}
              onClose={() => setShowNewDocumentDialog(false)}
              onSubmit={(formData) => {
                onCreateDocument({ ...formData, collectionId: id });
                setShowNewDocumentDialog(false);
              }}
              collections={[collection]}
              defaultCollectionId={id}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowNewDocumentDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <CollectionDialog
              trigger={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              }
              collection={collection}
              onSubmit={(formData) => onEdit(id, formData)}
            />
            {isAdmin && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <DeleteCollectionDialog
                  isOpen={showDeleteDialog}
                  onClose={() => setShowDeleteDialog(false)}
                  onConfirm={(deleteDocuments) => {
                    onDelete(id, deleteDocuments);
                    setShowDeleteDialog(false);
                  }}
                  collectionName={name}
                  documentCount={documents.length}
                />
              </>
            )}
          </div>
        </div>
        {description && (
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/dashboard/documents/${doc.id}`}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md group"
                >
                  <File className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                    {doc.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No documents yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
