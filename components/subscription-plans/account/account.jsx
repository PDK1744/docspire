"use client";

import { DollarSign } from "lucide-react";
import { useState } from "react";

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleManageSubscription}
      disabled={isLoading}
      className="flex items-center gap-2 hover:bg-base-300"
    >
      <DollarSign className="h-4 w-4" />
      <span>{isLoading ? "Loading..." : "Manage Subscription"}</span>
    </button>
  );
}
