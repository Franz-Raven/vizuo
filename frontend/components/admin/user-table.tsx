"use client";

import { useState, ComponentType } from "react";
import { AdminUser, UserRole, UserStatus } from "@/types/admin";
import {
  MoreHorizontal,
  Shield,
  Palette,
  User as UserIcon,
  CheckCircle2,
  Slash,
} from "lucide-react";

interface UserTableProps {
  users: AdminUser[];
  onRoleChange: (userId: number, newRole: UserRole) => void;
  onStatusChange: (userId: number, newStatus: UserStatus) => void;
}

const roleConfig: Record<
  UserRole,
  { label: string; icon: ComponentType<{ className?: string }>; classes: string }
> = {
  admin: {
    label: "Admin",
    icon: Shield,
    classes: "bg-secondary text-secondary-foreground",
  },
  designer: {
    label: "Designer",
    icon: Palette,
    classes: "bg-primary text-primary-foreground",
  },
};

const statusConfig: Record<
  UserStatus,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    classes: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    classes: "bg-emerald-500/10 text-emerald-500",
  },
  BANNED: {
    label: "Banned",
    icon: Slash,
    classes: "bg-red-500/10 text-red-500",
  },
};

export default function UserTable({
  users,
  onRoleChange,
  onStatusChange,
}: UserTableProps) {
  const [openRoleDropdown, setOpenRoleDropdown] = useState<number | null>(null);
  const [openActionsDropdown, setOpenActionsDropdown] = useState<number | null>(
    null
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/70 bg-card/80">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/70 bg-background/40">
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground tracking-wide">
                User
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground tracking-wide">
                Role
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground tracking-wide">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground tracking-wide">
                Joined
              </th>
              <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const roleCfg = roleConfig[user.role];
              const RoleIcon = roleCfg.icon;

              const statusCfg = statusConfig[user.status];
              const StatusIcon = statusCfg.icon;

              const isBanned = user.status === "BANNED";

              return (
                <tr
                  key={user.id}
                  className="border-b border-border/40 last:border-b-0 hover:bg-background/40 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* User */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenRoleDropdown(
                            openRoleDropdown === user.id ? null : user.id
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${roleCfg.classes}`}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                        {roleCfg.label}
                      </button>

                      {openRoleDropdown === user.id && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-popover border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                          {(Object.keys(roleConfig) as UserRole[]).map((r) => {
                            const option = roleConfig[r];
                            const OptionIcon = option.icon;
                            return (
                              <button
                                key={r}
                                onClick={() => {
                                  onRoleChange(user.id, r);
                                  setOpenRoleDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/60"
                              >
                                <OptionIcon className="h-3.5 w-3.5" />
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status (static pill, no dropdown) */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusCfg.classes}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions (3 dots with Ban / Unban) */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenActionsDropdown(
                              openActionsDropdown === user.id ? null : user.id
                            )
                          }
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted/60 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>

                        {openActionsDropdown === user.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                            <button
                              onClick={() => {
                                onStatusChange(user.id, isBanned ? "ACTIVE" : "BANNED");
                                setOpenActionsDropdown(null);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/60 ${
                                isBanned ? "text-emerald-500" : "text-red-500"
                              }`}
                            >
                              {isBanned ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Unban user</span>
                                </>
                              ) : (
                                <>
                                  <Slash className="h-3.5 w-3.5" />
                                  <span>Ban user</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
