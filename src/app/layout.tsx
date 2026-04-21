import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <Link href="/" className="brand">Web Dev Org</Link>
          <nav>
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/credits">Credits</Link>
            <Link href="/dashboard/user">Dashboard</Link>
            <Link href="/support">Support</Link>
            <Link href="/admin-divit-vkbk2turan-vjds">Admin</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
