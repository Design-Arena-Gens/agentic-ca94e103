import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-shell">
          <header className="app-header">
            <div>
              <h1>YouTube Production Agent</h1>
              <p>
                Autonomously strategize, script, and package high-performing
                YouTube videos ready for publishing.
              </p>
            </div>
            <div className="header-badges">
              <span className="badge blueprint">Blueprint Engine</span>
              <span className="badge automation">Automation Ready</span>
            </div>
          </header>
          <main>{children}</main>
          <footer className="app-footer">
            <p>
              Built for Design Arena — optimized for creative directors,
              strategists, and channel managers.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
