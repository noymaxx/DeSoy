"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { useUser } from "@civic/auth/react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn: login, signOut: logout, isLoading: loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWalletAction = async () => {
    if (user) {
      await logout();
    } else {
      await login();
    }
  };

  const WalletButton = () => {
    if (loading) {
      return (
        <Button disabled className="bg-yellow-500/70 text-black font-semibold">
          <Wallet className="w-4 h-4 mr-2" />
          Loading...
        </Button>
      );
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-gray-300">Connected as</span>
            <span className="text-yellow-400 font-semibold">
              {user.email || user.id || "Authenticated User"}
            </span>
          </div>
          <Button 
            onClick={handleWalletAction}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <Button 
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        onClick={handleWalletAction}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-yellow-500/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/desoy-logo.png"
              alt="deSoy Logo"
              width={146}
              height={44}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Benefits
            </a>
            <a
              href="#about"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              About
            </a>
            <a
              href="#tech"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Technology
            </a>
          </nav>

          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-yellow-500/30">
            <nav className="flex flex-col space-y-4 mt-4">
              <a
                href="#how-it-works"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Benefits
              </a>
              <a
                href="#about"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                About
              </a>
              <a
                href="#tech"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Technology
              </a>
              
              {/* Mobile Wallet Button */}
              <div className="pt-2">
                {user && (
                  <div className="text-center mb-3">
                    <p className="text-xs text-gray-400">Connected as</p>
                    <p className="text-yellow-400 font-semibold text-sm">
                      {user.email || user.id || "Authenticated User"}
                    </p>
                  </div>
                )}
                <WalletButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
