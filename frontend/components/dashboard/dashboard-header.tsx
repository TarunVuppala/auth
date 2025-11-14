"use client";

import { LogOut } from "lucide-react";

import type { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function DashboardHeader({
  welcomeMessage,
  user,
  onLogout,
}: {
  welcomeMessage: string;
  user: User;
  onLogout: () => Promise<void>;
}) {
  const roleCopy =
    user.role === "admin"
      ? "Admins can view every item and manage members."
      : "You can create and edit your own items.";

  return (
    <Card className="flex flex-col gap-6 rounded-4xl border-none bg-[color:var(--card)] p-8 shadow-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Dashboard
        </p>
        <CardTitle className="mt-2 text-3xl">{welcomeMessage}</CardTitle>
        <CardDescription className="mt-2 max-w-2xl">{roleCopy}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="success">{user.role.toUpperCase()}</Badge>
          <Badge variant="secondary">{user.email}</Badge>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="rounded-full gap-2"
        onClick={async () => {
          await onLogout();
        }}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </Card>
  );
}
