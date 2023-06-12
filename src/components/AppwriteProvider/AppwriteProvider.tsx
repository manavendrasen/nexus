"use client";

import useAppwrite from "@/store/AppwriteStore";
import React, { useEffect } from "react";

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
