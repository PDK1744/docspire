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

export function UserDialog({ isOpen, onClose, user }) {
    const { id, display_name, email, role, status } = user || {};
    const [name, setName] = useState(display_name || "");
    const [userRole, setUserRole] = useState(role || "n/a");
    const [userStatus, setUserStatus] = useState(status || "n/a");
    const [userEmail, setUserEmail] = useState(email || "");

    const roles = [
        { id: 'admin', name: 'Admin' },
        { id: 'member', name: 'Member' }]

    const statuses = [
        { id: 'active', name: 'Active' },
        { id: 'disabled', name: 'Disabled' }]


    // TODO: handle submit needs to update user role, name, status, etc. 
    // Will most likely send to an API route to handle this
    const handleSubmit = (e) => {
        e.preventDefault();
        // onSubmit({ title, collectionId: collectionId || defaultCollectionId || null });
        // setTitle("");
        // setCollectionId(defaultCollectionId);
        // onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
                        <Label htmlFor="collection">Role</Label>
                        <Select
                            value={userRole}
                            onValueChange={setUserRole}
                        >
                            <SelectTrigger>
                                <SelectValue />
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
                        <Label htmlFor="collection">Role</Label>
                        <Select
                            value={userStatus}
                            onValueChange={setUserStatus}
                        >
                            <SelectTrigger>
                                <SelectValue />
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
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="defaultGreen" disabled={!name.trim()}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
