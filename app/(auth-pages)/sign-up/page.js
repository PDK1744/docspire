"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import StatusMessage from "@/components/status-message";


export default function SignUpPage() {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <Link href="/" className="text-xl font-bold">DocSpire</Link>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Sign up to get started with DocSpire.  If joining a company, you will require a company code for the next step.
          </CardDescription>
          <StatusMessage />
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="space-y-6">





            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Your Name"
                  required
                />
              </div>

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
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Create Account
            </Button>


          </form>
        </CardContent>
        <CardFooter className="text-sm text-center">
          <div className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}