"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, PlusCircle, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/lib/contexts/WalletContext";
import { useBackendRegistration } from "@/lib/hooks/useBackendRegistration";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    walletAddress,
    isConnected,
    isLoading,
    connect,
    disconnect,
    createWallet,
    isCreatingWallet,
    hasWallet,
    user,
  } = useWallet();

  // Auto-register wallet with backend when connected
  const { isRegistering } = useBackendRegistration(walletAddress, isConnected);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      toast.success("Civic embedded wallet created successfully!");
    } catch (err: any) {
      console.error("Error creating Civic embedded wallet:", err);
      toast.error(err.message || "Failed to create Civic embedded wallet.");
    }
  };

  const handleWalletAction = async () => {
    try {
      if (isConnected) {
        await disconnect();
        toast.success("Wallet disconnected successfully!");
      } else {
        await connect();
      }
    } catch (err: any) {
      console.error("Wallet action error:", err);
      toast.error(err.message || "Wallet action failed.");
    }
  };

  const WalletButtonContent = () => {
    if (isLoading) {
      return (
        <Button disabled className="bg-yellow-500/70 text-black font-semibold">
          <Wallet className="w-4 h-4 mr-2" />
          Loading...
        </Button>
      );
    }

    if (isConnected && walletAddress) {
      const displayAddress = walletAddress;
      const shortAddress = `${displayAddress.substring(0, 6)}...${displayAddress.substring(displayAddress.length - 4)}`;
      return (
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-gray-300">Civic Wallet:</span>
            <span className="text-yellow-400 font-semibold" title={displayAddress}>
              {shortAddress}
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
    } else if (user && !hasWallet) {
      return (
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-gray-300">User: {user?.email || user?.id}</span>
            <span className="text-yellow-400 font-semibold">
              Civic wallet not created
            </span>
          </div>
          <Button
            onClick={handleCreateWallet}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold mr-2"
            disabled={isCreatingWallet}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Civic Wallet
          </Button>
          <Button
            onClick={handleWalletAction}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      );
    } else if (isCreatingWallet) {
      return (
        <Button disabled className="bg-blue-500/70 text-black font-semibold">
          <PlusCircle className="w-4 h-4 mr-2 animate-spin" />
          Creating Wallet...
        </Button>
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
            <a
              href="/wallet-demo"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Wallet Demo
            </a>
          </nav>

          <div className="hidden md:block">
            <WalletButtonContent />
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
              
              {/* Mobile Wallet Button/Info */}
              <div className="pt-4 border-t border-gray-700">
                <WalletButtonContent />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
