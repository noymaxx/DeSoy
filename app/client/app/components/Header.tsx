"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, LogOut, PlusCircle } from "lucide-react";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { toast } from "sonner";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userContext = useUser();
  const { user, signIn: login, signOut: logout, isLoading: loading, error } = userContext;

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isRegisteringWithBackend, setIsRegisteringWithBackend] = useState(false);

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

  useEffect(() => {
    const registerUserWalletWithBackend = async (address: string) => {
      if (isRegisteringWithBackend) return; // Prevent multiple calls
      setIsRegisteringWithBackend(true);
      console.log(`Attempting to register wallet ${address} with backend...`);
      try {
        // Ensure this URL points to your backend.
        // If client is on 3001 and server on 3000, direct URL is needed or proxy.
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'; 
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
          // Optional: toast.success(`Wallet ${data.walletAddress} registered/verified.`);
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

    if (user && userHasWallet(userContext)) {
      const walletAddress = userContext.ethereum.address;
      console.log("Civic User Object (from userContext.user):", JSON.stringify(user, null, 2));
      console.log("Embedded Wallet Address found:", walletAddress);
      registerUserWalletWithBackend(walletAddress);
    } else if (user && !userHasWallet(userContext)) {
      console.log("Civic User Object (from userContext.user):", JSON.stringify(user, null, 2));
      console.log("User does not have an embedded wallet yet. Wallet creation should be triggered by UI.");
    } else {
      console.log("Civic User Object: null");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [user, userContext, userHasWallet(userContext)]); // Added userHasWallet(userContext) to deps to re-run when wallet is created

  const handleCreateWallet = async () => {
    if (user && !userHasWallet(userContext) && userContext.createWallet) {
      setIsCreatingWallet(true);
      try {
        await userContext.createWallet();
        toast.success("Carteira embutida Civic criada com sucesso!");
        // The useEffect above should now pick up the new wallet address and call the backend.
      } catch (err: any) {
        console.error("Erro ao criar carteira embutida Civic:", err);
        toast.error(err.message || "Falha ao criar carteira embutida Civic.");
      }
      setIsCreatingWallet(false);
    }
  };

  const handleWalletAction = async () => {
    if (user) {
      await logout();
    } else {
      await login();
    }
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

    if (user) {
      if (userHasWallet(userContext)) {
        const displayAddress = userContext.ethereum.address;
        const shortAddress = `${displayAddress.substring(0, 6)}...${displayAddress.substring(displayAddress.length - 4)}`;
        return (
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col text-right text-xs">
              <span className="text-gray-300">Carteira Civic:</span>
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
              Desconectar
            </Button>
          </div>
        );
      } else if (userContext.walletCreationInProgress || isCreatingWallet) {
        return (
          <Button disabled className="bg-blue-500/70 text-black font-semibold">
            <PlusCircle className="w-4 h-4 mr-2 animate-spin" />
            Criando Carteira...
          </Button>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col text-right text-xs">
              <span className="text-gray-300">Usuário: {user.email || user.id}</span>
              <span className="text-yellow-400 font-semibold">
                Carteira Civic não criada
              </span>
            </div>
            <Button
              onClick={handleCreateWallet}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold mr-2"
              disabled={isCreatingWallet || userContext.walletCreationInProgress}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Carteira Civic
            </Button>
            <Button
              onClick={handleWalletAction}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        );
      }
    }

    return (
      <Button
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        onClick={handleWalletAction}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Conectar Login Civic
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
