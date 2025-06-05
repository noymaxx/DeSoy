"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createWallet: () => Promise<void>;
  isCreatingWallet: boolean;
  hasWallet: boolean;
  user: any;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_ADDRESS_KEY = 'civicEmbeddedWalletAddress';

export function WalletProvider({ children }: { children: ReactNode }) {
  const userContext = useUser();
  const { user, signIn, signOut, isLoading } = userContext;
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if user has an embedded wallet
  const hasWallet = userHasWallet(userContext);

  // Load wallet address from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY);
      if (savedAddress) {
        setWalletAddress(savedAddress);
        setIsConnected(true);
      }
    }
  }, []);

  // Monitor Civic authentication and wallet creation
  useEffect(() => {
    if (user && hasWallet && (userContext as any).ethereum?.address) {
      const address = (userContext as any).ethereum.address;
      setWalletAddress(address);
      setIsConnected(true);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_ADDRESS_KEY, address);
      }
      
      console.log('Wallet connected:', address);
    } else if (!user) {
      // User logged out
      setWalletAddress(null);
      setIsConnected(false);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(WALLET_ADDRESS_KEY);
      }
    }
  }, [user, hasWallet, (userContext as any).ethereum?.address]);

  const connect = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await signOut();
      setWalletAddress(null);
      setIsConnected(false);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(WALLET_ADDRESS_KEY);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const createWallet = async () => {
    if (!user || !(userContext as any).createWallet) {
      throw new Error('Cannot create wallet: user not authenticated or createWallet not available');
    }

    setIsCreatingWallet(true);
    try {
      await (userContext as any).createWallet();
      // The useEffect above will handle the wallet address update
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const contextValue: WalletContextType = {
    walletAddress,
    isConnected,
    isLoading,
    connect,
    disconnect,
    createWallet,
    isCreatingWallet,
    hasWallet,
    user,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 