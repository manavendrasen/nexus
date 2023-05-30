"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppwrite from "@/store/AppwriteStore";
import { Navbar } from "@/components/Navbar/Navbar";

export default function Dashboard() {
  const { me, fetchMe } = useAppwrite();
  const router = useRouter();
  // useEffect(() => {
  //   fetchMe();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!me) {
    router.back();
  } else if (!me.emailVerification) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Check your email to verify your account.</p>
      </div>
    );
  } else {
    return (
      <div>
        <Navbar />
        <div className="px-12 py-12">
          <h1>Dashboard</h1>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div>
      </div>
    );
  }
}
