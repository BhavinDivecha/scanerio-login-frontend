"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { logoutApi } from "@/app/api/global-api";
import { Loader } from "../elements/loader";

export default function LogoutClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "done" | "error">("pending");
  const [message, setMessage] = useState("Logging you out…");

  useEffect(() => {
    let cancelled = false;

    const doLogout = async () => {
      try {
        setStatus("pending");
        setMessage("Signing you out…");

        const request = logoutApi({});//axios.post("/v1/user/sessions/logout", {});

        toast.promise(request, {
          loading: "Signing you out…",
          success: "Signed out. Redirecting…",
          error: (err)=>{
            console.log(err);
            return "Couldn’t sign out. Redirecting…";
          },
        });

        await request;
        if (cancelled) return;
        setStatus("done");
        setMessage("Signed out. Redirecting…");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("Couldn’t fully sign out. Redirecting…");
      } finally {
        // Ensure local httpOnly cookies are cleared on our domain
        try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
        // Small delay so users see feedback, then go to login
        setTimeout(() => {
          // if (!cancelled) router.replace("/");
        }, 700);
      }
    };

    doLogout();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex justify-center items-center h-64">
          <Loader isLoading={true} message={message} />
        </div>
  );
}
