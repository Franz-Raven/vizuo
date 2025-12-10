"use client";

import { useEffect, useState, useMemo } from "react";
import BackgroundBlobs from "@/components/background-blobs";
import Header from "@/components/header";
import { toast } from "sonner";
import { getAdminUsers, updateUserRole, updateUserStatus } from "@/lib/api/admin";
import { AdminUser, UserRole, UserStatus } from "@/types/admin";
import AdminStats from "@/components/admin/admin-stats";
import UserFilters from "@/components/admin/user-filters";
import UserTable from "@/components/admin/user-table";

type JoinDateFilter = "all" | "day" | "week" | "month" | "year";

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [joinDateFilter, setJoinDateFilter] = useState<JoinDateFilter>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getAdminUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      }
    };

    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const createdAtDate = new Date(user.createdAt);
      if (isNaN(createdAtDate.getTime())) return false;

      const diffMs = now.getTime() - createdAtDate.getTime();

      let matchesJoinDate = true;
      if (joinDateFilter === "day") {
        matchesJoinDate = diffMs <= dayMs;
      } else if (joinDateFilter === "week") {
        matchesJoinDate = diffMs <= 7 * dayMs;
      } else if (joinDateFilter === "month") {
        matchesJoinDate = diffMs <= 30 * dayMs;
      } else if (joinDateFilter === "year") {
        matchesJoinDate = diffMs <= 365 * dayMs;
      }

      return matchesSearch && matchesRole && matchesJoinDate;
    });
  }, [users, searchQuery, roleFilter, joinDateFilter]);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      adminCount: users.filter((u) => u.role === "admin").length,
      designerCount: users.filter((u) => u.role === "designer").length,
    };
  }, [users]);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      const updated = await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );

      toast.success("Role updated");
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("Failed to update role");
    }
  };

  const handleStatusChange = async (userId: number, newStatus: UserStatus) => {
    try {
      const updated = await updateUserStatus(userId, newStatus);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: updated.status } : u))
      );

      toast.success("Status updated");
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />
      <main className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <div className="text-muted-foreground">
              Manage users and view platform statistics.
            </div>
          </div>

          <AdminStats {...stats} />

          <div className="p-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <span className="text-sm text-muted-foreground">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>

            <UserFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              joinDateFilter={joinDateFilter}
              onJoinDateFilterChange={setJoinDateFilter}
            />

            <UserTable users={filteredUsers} onRoleChange={handleRoleChange} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </main>
    </div>
  );
}
