"use client";

import { Shield, UserCog, Search, UserX, XCircle } from "lucide-react";

import type { AdminMetrics, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminPanelProps {
  metrics: AdminMetrics | null;
  users: User[];
  onPromote: (userId: string, role: "user" | "admin") => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  busyUserId: string | null;
  loading: boolean;
}

export function AdminPanel(props: AdminPanelProps) {
  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-500" />
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Admin tools
        </p>
      </div>

      <AdminStatsGrid metrics={props.metrics} />

      <MembersCard {...props} />
    </section>
  );
}

const AdminStatsGrid = ({ metrics }: { metrics: AdminMetrics | null }) => {
  const stats = [
    { label: "Total Users", value: metrics?.totalUsers ?? 0 },
    { label: "Admins", value: metrics?.adminCount ?? 0 },
    { label: "Members", value: metrics?.userCount ?? 0 },
    { label: "Tracked Items", value: metrics?.totalItems ?? 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

const MembersCard = ({
  users,
  onPromote,
  onDelete,
  searchTerm,
  onSearchTermChange,
  busyUserId,
  loading,
}: AdminPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCog className="h-5 w-5 text-muted-foreground" />
          Manage members
        </CardTitle>
        <CardDescription>Update roles, search accounts, and remove users.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              className="pl-9"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
            {searchTerm.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:opacity-80"
                onClick={() => onSearchTermChange("")}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {loading ? "Searching..." : "Results update as you type"}
          </div>
        </div>

        <MembersTable
          users={users}
          loading={loading}
          busyUserId={busyUserId}
          onPromote={onPromote}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};

const MembersTable = ({
  users,
  loading,
  busyUserId,
  onPromote,
  onDelete,
}: {
  users: User[];
  loading: boolean;
  busyUserId: string | null;
  onPromote: (userId: string, role: "user" | "admin") => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-6 text-center text-muted-foreground">
        Loading users...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UserX className="h-5 w-5" />
                  <span>No members found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-semibold text-foreground">
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "success" : "secondary"}>
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyUserId === user.id}
                      onClick={() =>
                        onPromote(user.id, user.role === "admin" ? "user" : "admin")
                      }
                    >
                      {user.role === "admin" ? "Demote" : "Promote"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      disabled={busyUserId === user.id}
                      onClick={() => onDelete(user.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card className="border-none bg-card shadow">
    <CardContent className="space-y-1 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </CardContent>
  </Card>
);
