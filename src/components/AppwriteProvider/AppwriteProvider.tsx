"use client";

import React, { useEffect } from "react";
import useAppwrite from "@/store/AppwriteStore";

interface AppwriteProviderProps {
  children: React.ReactNode;
}

export const AppwriteProvider: React.FC<AppwriteProviderProps> = ({
  children,
}) => {
  const { init } = useAppwrite();

  useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
