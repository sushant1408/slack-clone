"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SignUpCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { signIn } = useAuthActions();

  const handleProviderSignup = (provider: "github" | "google") => {
    setIsPending(true);
    signIn(provider).finally(() => setIsPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            disabled={isPending}
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            disabled={isPending}
          />
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            disabled={isPending}
          />
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => handleProviderSignup("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
            disabled={isPending}
          >
            <FcGoogle className="!size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleProviderSignup("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
            disabled={isPending}
          >
            <FaGithub className="!size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export { SignUpCard };
