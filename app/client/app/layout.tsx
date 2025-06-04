import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CivicAuthProvider } from "@civic/auth/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "deSoy - Decentralized Agricultural Finance",
  description:
    "Grow Capital. Fuel Agriculture. Earn high, stable returns by funding verified farmers through tokenized crop receivables.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <CivicAuthProvider>
          {children}
        </CivicAuthProvider>
      </body>
    </html>
  )
}
