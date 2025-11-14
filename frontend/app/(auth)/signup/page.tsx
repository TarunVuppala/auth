"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Shield, User, UserRoundPlus } from "lucide-react";

import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"], { required_error: "Select a role" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);
  const authLoading = useAuthStore((state) => state.authLoading);
  const authError = useAuthStore((state) => state.authError);
  const clearError = useAuthStore((state) => state.clearError);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "user",
    },
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

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
      router.replace("/dashboard");
    } catch {
      // handled with authError state
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-[32px] border border-[color:var(--border)] bg-[color:var(--card)] p-0 shadow-xl">
        <CardHeader className="space-y-4 border-b border-[color:var(--border)] p-8 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
            Join the platform
          </p>
          <CardTitle className="text-3xl">Create an account</CardTitle>
          <CardDescription>
            Choose your role now—you can always promote or demote members later.
          </CardDescription>
          <div className="flex gap-2">
            {(["user", "admin"] as UserRole[]).map((role) => (
              <Button
                key={role}
                type="button"
                variant={selectedRole === role ? "default" : "secondary"}
                size="sm"
                className="flex-1 rounded-2xl"
                onClick={() => handleRoleSelect(role)}
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
          <p className="text-sm text-muted-foreground">
            Signing up as{" "}
            <span className="font-semibold text-[color:var(--foreground)]">
              {selectedRole}
            </span>
          </p>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={selectedRole} readOnly {...register("role")} />
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" type="text" placeholder="Jane Doe" className="pl-9" {...register("name")} />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {authError && (
              <p className="rounded-2xl bg-[color:var(--color-badge-destructive-bg)]/60 px-4 py-3 text-sm text-[color:var(--color-badge-destructive-foreground)]">
                {authError}
              </p>
            )}

            <Button type="submit" size="lg" disabled={authLoading} className="w-full rounded-full gap-2">
              <UserRoundPlus className="h-4 w-4" />
              {authLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Already part of the team?{" "}
            <Link href="/login" className="font-semibold text-[color:var(--foreground)]">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
