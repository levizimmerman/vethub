import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Header, Footer } from "@/lib/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetHub - Veterinary Clinic Management",
  description: "Manage pet owners, pets, veterinarians, and visits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <Toaster position="top-right" richColors closeButton />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
