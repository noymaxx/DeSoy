"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Wallet, User, LogOut, Settings, PlusCircle, BarChart3, ChevronDown } from "lucide-react"

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [connectedWallet] = useState("0x1234...5678") // Mock wallet address

  const handleDisconnect = () => {
    // Handle wallet disconnection
    console.log("Disconnecting wallet...")
  }

  const handleSwitchUser = () => {
    // Handle user switching
    console.log("Switching user...")
  }

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-yellow-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/desoy-logo.png" alt="deSoy Logo" width={40} height={40} className="w-10 h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="text-gray-100 hover:text-yellow-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/tokenize" className="text-gray-100 hover:text-yellow-400 transition-colors">
              Tokenize
            </Link>
            <Link href="/portfolio" className="text-gray-100 hover:text-yellow-400 transition-colors">
              Portfolio
            </Link>
            <Link href="/governance" className="text-gray-100 hover:text-yellow-400 transition-colors">
              Governance
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Actions */}
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              asChild
            >
              <Link href="/tokenize">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  {connectedWallet}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem className="hover:bg-gray-700">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleSwitchUser} className="hover:bg-gray-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Switch Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisconnect} className="hover:bg-gray-700 text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-yellow-500/30">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="/marketplace" className="text-gray-100 hover:text-yellow-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/tokenize" className="text-gray-100 hover:text-yellow-400 transition-colors">
                Tokenize
              </Link>
              <Link href="/portfolio" className="text-gray-100 hover:text-yellow-400 transition-colors">
                Portfolio
              </Link>
              <Link href="/governance" className="text-gray-100 hover:text-yellow-400 transition-colors">
                Governance
              </Link>
              <div className="pt-4 border-t border-gray-700">
                <div className="text-gray-400 text-sm mb-2">Connected: {connectedWallet}</div>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    asChild
                  >
                    <Link href="/tokenize">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Project
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={handleSwitchUser}
                  >
                    Switch Wallet
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
