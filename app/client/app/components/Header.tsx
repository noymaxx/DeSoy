"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { useCivicAuth } from "@civic/auth/nextjs/client";
import { toast } from "sonner";

// Custom hook for EVM wallet management with localStorage
const useEVMWallet = () => {
  const [evmWalletAddress, setEvmWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('civic_evm_wallet_address');
    if (savedWallet) {
      setEvmWalletAddress(savedWallet);
    }
  }, []);

  const saveWalletToStorage = (address: string) => {
    localStorage.setItem('civic_evm_wallet_address', address);
    setEvmWalletAddress(address);
  };

  const clearWalletFromStorage = () => {
    localStorage.removeItem('civic_evm_wallet_address');
    setEvmWalletAddress(null);
  };

  const connectEVMWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("MetaMask não está instalado. Instale para conectar sua carteira EVM.");
      return null;
    }

    setIsConnectingWallet(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        saveWalletToStorage(address);
        toast.success(`Carteira EVM conectada: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
        return address;
      }
    } catch (error: any) {
      console.error('Erro ao conectar carteira EVM:', error);
      toast.error(error.message || "Erro ao conectar carteira EVM");
    } finally {
      setIsConnectingWallet(false);
    }
    return null;
  };

  return {
    evmWalletAddress,
    isConnectingWallet,
    connectEVMWallet,
    clearWalletFromStorage,
    saveWalletToStorage
  };
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisteringWithBackend, setIsRegisteringWithBackend] = useState(false);

  // Use standard Civic auth hooks
  const { user, login, logout, loading, error } = useCivicAuth();
  
  // Use custom EVM wallet hook
  const { 
    evmWalletAddress, 
    isConnectingWallet, 
    connectEVMWallet, 
    clearWalletFromStorage 
  } = useEVMWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Civic Auth Error:", error);
      toast.error(error.message || "An authentication error occurred.");
    }
  }, [error]);

  // Register user with backend when both Civic user and EVM wallet are available
  useEffect(() => {
    const registerUserWalletWithBackend = async (address: string) => {
      if (isRegisteringWithBackend) return;
      setIsRegisteringWithBackend(true);
      console.log(`Attempting to register wallet ${address} with backend...`);
      
      try {
        // Updated to use port 3001 where your backend is running
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'; 
        const response = await fetch(`${backendUrl}/api/v1/users/wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: address }),
        });
        
        const data = await response.json();
        if (response.ok) {
          console.log('Backend response (user processed):', data);
          toast.success(`Usuário registrado no backend: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
        } else {
          console.error('Backend error (processing user):', data);
          toast.error(data.message || 'Falha ao registrar carteira com o backend.');
        }
      } catch (err: any) {
        console.error('Network error registering wallet with backend:', err);
        toast.error('Erro de rede ao comunicar com o backend.');
      } finally {
        setIsRegisteringWithBackend(false);
      }
    };

    if (user && evmWalletAddress) {
      console.log("Civic User Object:", JSON.stringify(user, null, 2));
      console.log("EVM Wallet Address:", evmWalletAddress);
      registerUserWalletWithBackend(evmWalletAddress);
    }
  }, [user, evmWalletAddress, isRegisteringWithBackend]);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
    clearWalletFromStorage(); // Clear wallet from localStorage on logout
    toast.info("Desconectado da Civic e carteira EVM removida.");
  };

  const handleConnectWallet = async () => {
    if (!user) {
      toast.error("Faça login com a Civic primeiro.");
      return;
    }
    await connectEVMWallet();
  };

  const WalletButtonContent = () => {
    if (loading) {
      return (
        <Button disabled className="bg-yellow-500/70 text-black font-semibold">
          <Wallet className="w-4 h-4 mr-2" />
          Carregando...
        </Button>
      );
    }

    if (user && evmWalletAddress) {
      const shortAddress = `${evmWalletAddress.substring(0, 6)}...${evmWalletAddress.substring(evmWalletAddress.length - 4)}`;
      return (
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-gray-300">Civic: {user.email || user.id || "Conectado"}</span>
            <span className="text-yellow-400 font-semibold" title={evmWalletAddress}>
              EVM: {shortAddress}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Desconectar
          </Button>
        </div>
      );
    }

    if (user && !evmWalletAddress) {
      return (
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-gray-300">Civic: {user.email || user.id || "Conectado"}</span>
            <span className="text-red-400 font-semibold">
              Carteira EVM não conectada
            </span>
          </div>
          <Button
            onClick={handleConnectWallet}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold mr-2"
            disabled={isConnectingWallet}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnectingWallet ? "Conectando..." : "Conectar Carteira EVM"}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        onClick={handleLogin}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Login Civic + EVM
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

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#benefits"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Benefícios
            </a>
            <a
              href="#about"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Sobre
            </a>
            <a
              href="#tech"
              className="text-gray-100 hover:text-yellow-400 transition-colors"
            >
              Tecnologia
            </a>
          </nav>

          <div className="hidden md:block">
            <WalletButtonContent />
          </div>

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

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-yellow-500/30">
            <nav className="flex flex-col space-y-4 mt-4">
              <a
                href="#how-it-works"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Como Funciona
              </a>
              <a
                href="#benefits"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Benefícios
              </a>
              <a
                href="#about"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Sobre
              </a>
              <a
                href="#tech"
                className="text-gray-100 hover:text-yellow-400 transition-colors"
              >
                Tecnologia
              </a>
              
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
