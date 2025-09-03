import { File, Plus, MoreVertical, Settings, Trash2, Trash } from "lucide-react";
import Link from "next/link";
import { CollectionDialog } from "@/components/collection-dialog";
import { DeleteCollectionDialog } from "@/components/delete-collection-dialog";
import { DocumentDialog } from "@/components/document-dialog";
import { useState } from "react";

export function DocumentTile({ collection, documents = [], onEdit, onDelete, onCreateDocument, onDeleteDocument, isAdmin }) {
  const { id, name, description, icon, color = "blue" } = collection;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200">
      {/* Card Header */}
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h2 className="card-title text-md font-semibold text-base-content">{name}</h2>
          <div className="flex items-center gap-1">
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
            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={() => setShowNewDocumentDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </button>
            {isAdmin && (
              <CollectionDialog
                trigger={
                  <button className="btn btn-ghost btn-sm btn-square">
                    <Settings className="h-4 w-4" />
                  </button>
                }
                collection={collection}
                onSubmit={(formData) => onEdit(id, formData)}
              />
            )}
            {isAdmin && (
              <>
                <button
                  className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" color="red"/>
                </button>
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
        
        {/* description area */}
        {description && (
          <div className="">
            <p className="text-xs text-base-content/70 line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Documents list */}
        <div className="min-h-0">
          <div className="divider divider-primary"></div>
          {documents.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200/50 group transition-colors duration-150">
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="flex items-center gap-2 flex-grow min-w-0"
                      >
                        <File className="h-4 w-4 text-base-content/40 group-hover:text-primary flex-shrink-0" />
                        <span className="text-sm text-base-content/80 group-hover:text-primary truncate transition-colors duration-150">
                          {doc.title}
                        </span>
                      </Link>

                      {isAdmin && (
                        <button
                          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          onClick={(e) => {
                            e.preventDefault(); 
                            onDelete(doc.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 " color="red"/>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-6">
              <File className="h-8 w-8 text-base-content/30 mx-auto mb-2" />
              <p className="text-sm text-base-content/60">
                No documents yet
              </p>
              <button
                className="btn btn-sm btn-outline btn-primary mt-3"
                onClick={() => setShowNewDocumentDialog(true)}
              >
                <Plus className="h-3 w-3" />
                Add Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}