import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CivicAuthProvider } from "@civic/auth-web3/react"
import { Toaster } from "@/components/ui/sonner"
import { WalletProvider } from "@/lib/contexts/WalletContext"

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
  const civicClientId = "161a57bc-f60e-462f-ab4b-8652c82936fa" // Your Client ID

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <CivicAuthProvider clientId={civicClientId}>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </CivicAuthProvider>
      </body>
    </html>
  )
}
