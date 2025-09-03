"use client";
import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Calendar,
  Shield,
  ShieldCheck,
  Crown,
  Edit3,
  Trash2,
  Mail,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { date } from "zod";
import { UserDialog } from "../user-dialog";

export default function TeamList({ companyId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showUserDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchTeamMembers = async (companyId) => {
    const res = await fetch(`/api/team/${companyId}`);
    if (!res.ok) {
      console.error("Failed to fetch team members");
      return [];
    }
    return res.json();
  };

  const {
    data: teamProfiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teamProfiles", companyId],
    queryFn: () => fetchTeamMembers(companyId),
    enabled: !!companyId,
  });

  const teamMembers = teamProfiles || [];

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-warning-content" />;
      case "editor":
        return <ShieldCheck className="h-4 w-4 text-info-content" />;
      case "member":
        return <Shield className="h-4 w-4 text-success-content" />;
      default:
        return <Shield className="h-4 w-4 text-success-content" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "badge-warning",
      editor: "badge-info", 
      member: "badge-success",
    };

    return (
      <div className={cn("badge gap-1.5", styles[role] || styles.member)}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const isActive = status === "active";
    
    return (
      <div className={cn("badge gap-1.5", isActive ? "badge-success" : "badge-error")}>
        <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-success-content" : "bg-error-content")} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-1/3 mb-2"></div>
        <div className="skeleton h-4 w-1/2 mb-6"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="skeleton h-16 w-full"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Team Members</h1>
            <p className="text-base-content/60">Manage your team and their permissions</p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center py-12">
            <Users className="h-12 w-12 text-error mx-auto mb-4" />
            <p className="text-error font-medium">Failed to load team members</p>
            <p className="text-base-content/60 mt-1">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Team Members</h1>
          <p className="text-base-content/60">Manage your team and their permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/20 rounded-lg">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Total Members</p>
                <p className="text-2xl font-bold text-base-content">{teamMembers.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-success-content rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Active Members</p>
                <p className="text-2xl font-bold text-base-content">
                  {teamMembers.filter((m) => m.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Crown className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Admins</p>
                <p className="text-2xl font-bold text-base-content">
                  {teamMembers.filter((m) => m.role === "admin").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-base-content/50" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="select select-bordered"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="card bg-base-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-base-300">
          <h3 className="text-lg font-medium text-base-content">
            Team Members ({filteredMembers.length})
          </h3>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="border-base-300">
                <th className="text-base-content/70 font-semibold">Member</th>
                <th className="text-base-content/70 font-semibold">Role</th>
                <th className="text-base-content/70 font-semibold">Join Date</th>
                <th className="text-base-content/70 font-semibold">Status</th>
                <th className="text-right text-base-content/70 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-base-200/50 border-base-300">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="">
                        <div className="bg-neutral text-neutral-content rounded-full flex items-center justify-center w-10 h-10">
                          <span className="text-sm">{getInitials(member.display_name)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-base-content">{member.display_name}</p>
                        <p className="text-sm text-base-content/60">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td>
                    <div className="flex items-center gap-2 text-base-content">
                      <Calendar className="h-4 w-4 text-base-content/50" />
                      {formatDate(member.created_at)}
                    </div>
                  </td>
                  <td>{getStatusBadge(member.status)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary"
                        onClick={() => setSelectedUser(member) || setUserDialog(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm text-base-content/50 hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-base-300">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                      <span className="text-sm">{getInitials(member.display_name)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base-content truncate">{member.display_name}</p>
                    <p className="text-sm text-base-content/60 truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                      <Calendar className="h-3 w-3" />
                      {formatDate(member.created_at)}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm text-base-content/50"
                  onClick={() => setSelectedUser(member) || setUserDialog(true)}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {getRoleBadge(member.role)}
                  {getStatusBadge(member.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-base-content/40 mx-auto mb-4" />
            <p className="text-base-content/60">No team members found</p>
            <p className="text-sm text-base-content/50 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
      
      {showUserDialog && selectedUser && (
        <UserDialog
          isOpen={showUserDialog}
          onClose={() => setUserDialog(false)}
          user={selectedUser}
          companyId={companyId}
        />
      )}
    </div>
  );
}