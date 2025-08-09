"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle} from "lucide-react"

export default function StatusMessage() {
    const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (!error && !success) return null; // Nothing to show

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert className="mb-4 border-green-500 bg-green-50 text-green-900">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{decodeURIComponent(success)}</AlertDescription>
      </Alert>
    );
  }
}