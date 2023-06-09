import "./globals.css";
import { Inter } from "next/font/google";
import { AppwriteProvider } from "@/components/AppwriteProvider/AppwriteProvider";
import { AlertProvider } from "@/components/AlertProvider/AlertProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexux - Build your Network | Survey",
  description: "Nexux is a survey platform built on top of Appwrite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          <AppwriteProvider>{children}</AppwriteProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
