"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Building2 } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { useState } from "react";

export default function SignUpPage() {
  const [signUpType, setSignUpType] = useState("create");
  const [showCompanyField, setShowCompanyField] = useState(true);

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
          <CardDescription className="text-center">
            Choose how you want to join DocSpire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="space-y-6">
            <RadioGroup
              defaultValue="create"
              onValueChange={(value) => {
                setSignUpType(value);
                setShowCompanyField(value === "create");
              }}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 space-y-0">
                <RadioGroupItem value="create" id="create" />
                <Label
                  htmlFor="create"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Create a Company Space</div>
                    <p className="text-sm text-gray-500">
                      Start fresh with your own documentation hub
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-y-0">
                <RadioGroupItem value="join" id="join" />
                <Label
                  htmlFor="join"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div>
                    <div className="font-medium">Join an Existing Company</div>
                    <p className="text-sm text-gray-500">
                      You&apos;ll need an invitation from your company admin
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4">
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

              {showCompanyField && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Acme Inc."
                    required={signUpType === "create"}
                  />
                </div>
              )}

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

              <input type="hidden" name="signUpType" value={signUpType} />
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {signUpType === "create" ? "Create Company Space" : "Create Account"}
              </Button>

              {signUpType === "join" && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Note: You'll need to be invited by your company admin to access the platform
                </p>
              )}
            </div>
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