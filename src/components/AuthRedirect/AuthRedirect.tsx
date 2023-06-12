"use client";

import useAppwrite from "@/store/AppwriteStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAlert } from "../AlertProvider/AlertProvider";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { getMe, accountService, authLoading } = useAppwrite();
  const router = useRouter();
  const { successAlert } = useAlert();

  const getMeAndRedirect = async () => {
    try {
      const isAuth = await getMe();

      if (isAuth) {
        console.log("User is logged in");
        successAlert("Signing you in...");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getMeAndRedirect();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountService]);

  return (
    <div className={`${authLoading && "pointer-events-none cursor-wait"}`}>
      {children}
    </div>
  );
};
