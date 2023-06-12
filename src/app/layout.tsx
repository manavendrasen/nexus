import { AlertProvider } from "@/components/AlertProvider/AlertProvider";
import { AppwriteProvider } from "@/components/AppwriteProvider/AppwriteProvider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus - Build your Network | Survey",
  description: "Nexus is a survey platform built on top of Appwrite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={inter.className}>
        <AlertProvider>
          <AppwriteProvider>{children}</AppwriteProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
