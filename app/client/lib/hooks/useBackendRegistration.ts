"use client";

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export function useBackendRegistration(walletAddress: string | null, isConnected: boolean) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const registerUserWalletWithBackend = async (address: string, retryCount = 0) => {
      if (isRegistering || isRegistered || registrationFailed) return;
      
      setIsRegistering(true);
      console.log(`🔄 Registering wallet ${address} with backend... (Attempt ${retryCount + 1}/${maxRetries})`);
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const fullUrl = `${backendUrl}/api/v1/users/wallet`;
        console.log(`🔍 DEBUG: Backend URL being used: ${fullUrl}`);
        console.log(`🔍 DEBUG: NEXT_PUBLIC_BACKEND_URL = ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
        
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: address }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ Backend registration successful:', data);
          setIsRegistered(true);
          setRegistrationFailed(false);
          retryCountRef.current = 0;
          toast.success(`Wallet registered successfully!`);
        } else {
          console.error('❌ Backend registration error:', data);
          throw new Error(data.message || 'Backend registration failed');
        }
      } catch (err: any) {
        console.error(`❌ Network error during wallet registration (attempt ${retryCount + 1}):`, err.message);
        
        // Implement exponential backoff with maximum retries
        if (retryCount < maxRetries - 1) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Retrying in ${delay}ms...`);
          
          retryTimeoutRef.current = setTimeout(() => {
            registerUserWalletWithBackend(address, retryCount + 1);
          }, delay);
          
          retryCountRef.current = retryCount + 1;
        } else {
          console.error('💥 Max retries reached. Registration failed permanently.');
          setRegistrationFailed(true);
          setIsRegistered(false);
          retryCountRef.current = 0;
          toast.error('Failed to register wallet with backend. Please check your network connection and try again later.');
        }
      } finally {
        setIsRegistering(false);
      }
    };

    if (isConnected && walletAddress && !isRegistered && !registrationFailed) {
      registerUserWalletWithBackend(walletAddress, retryCountRef.current);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [isConnected, walletAddress, isRegistered, registrationFailed]);

  // Reset registration status when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setIsRegistered(false);
      setRegistrationFailed(false);
      retryCountRef.current = 0;
      
      // Clear any pending retries
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    }
  }, [isConnected]);

  // Manual retry function for UI
  const retryRegistration = () => {
    if (walletAddress && isConnected && !isRegistering) {
      setRegistrationFailed(false);
      retryCountRef.current = 0;
    }
  };

  return { 
    isRegistering, 
    isRegistered, 
    registrationFailed,
    retryRegistration 
  };
} 