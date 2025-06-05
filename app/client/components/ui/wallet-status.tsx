"use client";

import { useWallet } from "@/lib/contexts/WalletContext";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface WalletStatusProps {
  showFullAddress?: boolean;
  className?: string;
}

export function WalletStatus({ showFullAddress = false, className = "" }: WalletStatusProps) {
  const { walletAddress, isConnected, isLoading, user, hasWallet } = useWallet();

  if (isLoading) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (!user) {
    return (
      <Badge variant="destructive" className={`flex items-center gap-2 ${className}`}>
        <XCircle className="w-3 h-3" />
        Not Authenticated
      </Badge>
    );
  }

  if (!hasWallet) {
    return (
      <Badge variant="outline" className={`flex items-center gap-2 ${className}`}>
        <Wallet className="w-3 h-3" />
        No Wallet
      </Badge>
    );
  }

  if (isConnected && walletAddress) {
    const displayAddress = showFullAddress 
      ? walletAddress 
      : `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
    
    return (
      <Badge variant="default" className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 ${className}`}>
        <CheckCircle className="w-3 h-3" />
        {displayAddress}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`flex items-center gap-2 ${className}`}>
      <Wallet className="w-3 h-3" />
      Disconnected
    </Badge>
  );
}

export default WalletStatus; 