"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
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
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full mt-4">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
