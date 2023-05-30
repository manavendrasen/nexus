"use client";

import React, { createContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AlertContextType {
  successAlert: (msg: string) => void;
  errorAlert: (msg: string) => void;
  infoAlert: (msg: string) => void;
}

export const AlertContext = createContext<AlertContextType>({
  successAlert: () => {},
  errorAlert: () => {},
  infoAlert: () => {},
});

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const successAlert = (msg: string) => {
    toast.success(msg);
  };

  const errorAlert = (msg: string) => {
    toast.error(msg);
  };

  const infoAlert = (msg: string) => {
    toast.info(msg);
  };

  const value = React.useMemo(
    () => ({
      successAlert,
      errorAlert,
      infoAlert,
    }),
    []
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => React.useContext(AlertContext);
