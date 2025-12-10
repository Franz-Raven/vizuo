import { Search, Filter, ChevronDown, Calendar, UserCheck } from "lucide-react";
import { useState } from "react";
import { UserRole, UserStatus } from "@/types/admin";

type JoinDateFilter = "all" | "day" | "week" | "month" | "year";

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: UserRole | "all";
  onRoleFilterChange: (role: UserRole | "all") => void;
  statusFilter: UserStatus | "all";
  onStatusFilterChange: (status: UserStatus | "all") => void;
  joinDateFilter: JoinDateFilter;
  onJoinDateFilterChange: (value: JoinDateFilter) => void;
}

export default function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  joinDateFilter,
  onJoinDateFilterChange,
}: UserFiltersProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const roles = [
    { value: "all" as UserRole | "all", label: "All roles" },
    { value: "admin" as UserRole, label: "Admin" },
    { value: "designer" as UserRole, label: "Designer" },
  ];

  const statuses: { value: UserStatus | "all"; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "active" as UserStatus, label: "Active" },
    { value: "banned" as UserStatus, label: "Banned" },
  ];

  const dates: { value: JoinDateFilter; label: string }[] = [
    { value: "all", label: "All dates" },
    { value: "day", label: "Last day" },
    { value: "week", label: "Last week" },
    { value: "month", label: "Last month" },
    { value: "year", label: "Last year" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3">
        {/* Role filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowStatusDropdown(false);
              setShowDateDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>{roles.find((r) => r.value === roleFilter)?.label}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showRoleDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => {
                    onRoleFilterChange(role.value);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                    roleFilter === role.value ? "bg-muted" : ""
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowRoleDropdown(false);
              setShowDateDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm"
          >
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <span>{statuses.find((s) => s.value === statusFilter)?.label}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusFilterChange(status.value);
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                    statusFilter === status.value ? "bg-muted" : ""
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Join date filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowRoleDropdown(false);
              setShowStatusDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{dates.find((d) => d.value === joinDateFilter)?.label}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden">
              {dates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => {
                    onJoinDateFilterChange(date.value);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                    joinDateFilter === date.value ? "bg-muted" : ""
                  }`}
                >
                  {date.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
