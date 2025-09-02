"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}
