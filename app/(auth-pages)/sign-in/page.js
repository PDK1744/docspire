"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import StatusMessage from "@/components/status-message";

export default async function SignInPage() {
  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <Link href="/" className="text-xl font-bold">DocSpire</Link>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
          <StatusMessage />
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-sm text-center">
          <Link 
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-500"
          >
            Forgot your password?
          </Link>
          <div className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link 
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}