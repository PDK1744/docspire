"use client";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UserDialog({ isOpen, onClose, user, companyId }) {
    const queryClient = useQueryClient();

    const { id, display_name, email, role, status } = user || {};
    const [userId, setUserId] = useState(id || "");
    const [name, setName] = useState(display_name || "");
    const [userRole, setUserRole] = useState(role || "");
    const [userStatus, setUserStatus] = useState(status || "");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    const roles = [
        { id: 'admin', name: 'Admin' },
        { id: 'member', name: 'Member' }
    ];

    const statuses = [
        { id: 'active', name: 'Active' },
        { id: 'disabled', name: 'Disabled' }
    ];

    const updateUserMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await fetch(`/api/team/user/${companyId}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teamProfiles'] });
            setSuccess("User updated successfully");
            setError(null);
            // Optional: Close dialog after a brief delay to show success message
            setTimeout(() => {
                onClose();
                setSuccess("");
            }, 1000);
        },
        onError: (error) => {
            setError(error.message);
            setSuccess("");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const userData = {
            display_name: name,
            role: userRole,
            status: userStatus
        };
        
        updateUserMutation.mutate(userData);
    };

    return (
  <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
    <div className="modal-box max-w-sm">
      <h3 className="font-bold text-lg">User Details</h3>

      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        {/* User Name */}
        <div className="form-control">
          <label htmlFor="name" className="label">
            <span className="label-text">User Name</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Role */}
        <div className="form-control">
          <label htmlFor="role" className="label">
            <span className="label-text">Role</span>
          </label>
          <select
            id="role"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">
              Select a role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="form-control">
          <label htmlFor="status" className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            id="status"
            value={userStatus}
            onChange={(e) => setUserStatus(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">
              Select a status
            </option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-sm">{success}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm">Error: {error}</p>
        )}

        {/* Footer */}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={!name.trim() || updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  </dialog>
);

}