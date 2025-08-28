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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">User Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={userRole}
                            onValueChange={setUserRole}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={userStatus}
                            onValueChange={setUserStatus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                        {status.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Success Message */}
                    {success && (
                        <p className="text-green-600 text-sm">{success}</p>
                    )}
                    
                    {/* Error Message */}
                    {error && (
                        <p className="text-red-600 text-sm">Error: {error}</p>
                    )}
                    
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="defaultGreen" 
                            disabled={!name.trim() || updateUserMutation.isPending}
                        >
                            {updateUserMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}