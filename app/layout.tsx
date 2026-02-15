import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ntigi Shipping - Courier Management System",
  description: "Complete serverless shipping and courier management platform for African markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <body className="antialiased" style={{ fontFamily: "'Quicksand', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
