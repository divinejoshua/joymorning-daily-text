import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joymorning Daily Text",
  description: "A daily text experience for reflective mornings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
