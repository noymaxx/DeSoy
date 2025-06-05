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
    if (user) {
      console.log("Civic User Object (from userContext.user):", JSON.stringify(user, null, 2));
      if (userHasWallet(userContext)) {
        console.log("Embedded Wallet Address:", userContext.ethereum.address);
      } else {
        console.log("User does not have an embedded wallet yet.");
      }
    } else {
      console.log("Civic User Object: null");
    }
  }, [user, userContext]);

  const handleCreateWallet = async () => {
    if (user && !userHasWallet(userContext) && userContext.createWallet) {
      setIsCreatingWallet(true);
      try {
        await userContext.createWallet();
        toast.success("Carteira embutida criada com sucesso!");
      } catch (err: any) {
        console.error("Erro ao criar carteira embutida:", err);
        toast.error(err.message || "Falha ao criar carteira embutida.");
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
              <span className="text-gray-300">Carteira Embutida:</span>
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
                Carteira não criada
              </span>
            </div>
            <Button 
              onClick={handleCreateWallet}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold mr-2"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Carteira Embutida
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
