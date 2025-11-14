"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, LogIn, Shield, User } from "lucide-react";

import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const authLoading = useAuthStore((state) => state.authLoading);
  const authError = useAuthStore((state) => state.authError);
  const clearError = useAuthStore((state) => state.clearError);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [roleError, setRoleError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!initializing && user) {
      router.replace("/dashboard");
    }
  }, [user, initializing, router]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setRoleError(null);
      const loggedInUser = await login(values);
      if (loggedInUser.role !== selectedRole) {
        await logout();
        setRoleError(
          `That account is a ${loggedInUser.role}. Switch to the ${loggedInUser.role} tab to continue.`,
        );
        return;
      }
      router.replace("/dashboard");
    } catch {
      // handled with authError state
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-4xl border border-[color:var(--border)] bg-[color:var(--card)] p-0 shadow-xl">
        <CardHeader className="space-y-4 border-b border-[color:var(--border)] p-8 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--muted-foreground)]">
            Welcome back
          </p>
          <CardTitle className="text-3xl">Log in</CardTitle>
          <CardDescription>
            Access your workspace dashboard. Need an account?{" "}
            <Link href="/signup" className="font-semibold text-[color:var(--foreground)]">
              Sign up here.
            </Link>
          </CardDescription>
          <div className="flex gap-2">
            {(["user", "admin"] as UserRole[]).map((role) => (
              <Button
                key={role}
                type="button"
                variant={selectedRole === role ? "default" : "secondary"}
                size="sm"
                className="flex-1 rounded-2xl"
                onClick={() => {
                  setSelectedRole(role);
                  setRoleError(null);
                }}
              >
                {role === "admin" ? (
                  <Shield className="mr-2 h-4 w-4" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                {role === "admin" ? "Admin" : "User"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Logging in as{" "}
            <span className="font-semibold text-[color:var(--foreground)]">
              {selectedRole}
            </span>
          </p>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <p className="rounded-2xl bg-[color:var(--color-badge-destructive-bg)]/60 px-4 py-3 text-sm text-[color:var(--color-badge-destructive-foreground)]">
                {authError}
              </p>
            )}
            {roleError && (
              <p className="rounded-2xl bg-amber-100/80 px-4 py-3 text-sm text-amber-800">
                {roleError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={authLoading}
              className="w-full rounded-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              {authLoading ? "Signing you in..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
