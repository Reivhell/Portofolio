import type { Metadata } from "next";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahmad David Alvees — Full-Stack Developer & Mobile Developer",
  description:
    "Ahmad David Alvees is a freelance full-stack developer and interface designer building fast, considered web products — from first wireframe to production deploy.",
  openGraph: {
    title: "David — Full-Stack Developer & Mobile Developer",
    description:
      "Fast, considered web products — from first wireframe to production deploy.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#F1EFE8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased no-js" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <a className="skip-link" href="#home">
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
