"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuddyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkin");
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--text-muted)" }}>
      Connecting to Buddy...
    </div>
  );
}
