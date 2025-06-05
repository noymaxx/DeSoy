"use client";

import { useWallet } from "@/lib/contexts/WalletContext";
import { useBackendRegistration } from "@/lib/hooks/useBackendRegistration";
import { WalletStatus } from "@/components/ui/wallet-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, User, Wallet, Shield, Database } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function WalletDemoPage() {
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

  const { isRegistering, isRegistered, registrationFailed, retryRegistration } = useBackendRegistration(walletAddress, isConnected);

  const handleRefresh = () => {
    window.location.reload();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-white">Wallet Demo Page</h1>
          
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Wallet Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connection Status
            </CardTitle>
            <CardDescription>
              This page demonstrates wallet state persistence across different pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <WalletStatus showFullAddress className="text-lg px-4 py-2" />
              <div className="flex gap-2">
                {!isConnected && (
                  <Button onClick={connect} disabled={isLoading}>
                    Connect Wallet
                  </Button>
                )}
                {isConnected && (
                  <Button onClick={disconnect} variant="outline">
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* User Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Authenticated:</span>
                <Badge variant={user ? "default" : "destructive"}>
                  {user ? "Yes" : "No"}
                </Badge>
              </div>
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-mono">{user.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User ID:</span>
                    <span className="text-sm font-mono">{user.id?.substring(0, 8)}...</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loading:</span>
                <Badge variant={isLoading ? "secondary" : "outline"}>
                  {isLoading ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Embedded Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Has Wallet:</span>
                <Badge variant={hasWallet ? "default" : "outline"}>
                  {hasWallet ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Connected:</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Yes" : "No"}
                </Badge>
              </div>
              {walletAddress && (
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Address:</span>
                  <div 
                    className="text-xs font-mono bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(walletAddress)}
                    title="Click to copy"
                  >
                    {walletAddress}
                  </div>
                </div>
              )}
              {user && !hasWallet && (
                <Button 
                  onClick={createWallet} 
                  disabled={isCreatingWallet}
                  className="w-full"
                >
                  {isCreatingWallet ? "Creating..." : "Create Embedded Wallet"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Backend Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backend Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registering:</span>
                <Badge variant={isRegistering ? "secondary" : "outline"}>
                  {isRegistering ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registered:</span>
                <Badge variant={isRegistered ? "default" : "outline"}>
                  {isRegistered ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Failed:</span>
                <Badge variant={registrationFailed ? "destructive" : "outline"}>
                  {registrationFailed ? "Yes" : "No"}
                </Badge>
              </div>
              {registrationFailed && (
                <Button 
                  onClick={retryRegistration} 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-2"
                >
                  Retry Registration
                </Button>
              )}
              <div className="text-xs text-gray-500">
                Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}
              </div>
            </CardContent>
          </Card>

          {/* Local Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Persistence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                The wallet address is automatically saved to localStorage and restored when you:
              </div>
              <ul className="text-xs space-y-1 text-gray-500">
                <li>• Refresh the page</li>
                <li>• Navigate between pages</li>
                <li>• Close and reopen the browser</li>
                <li>• Return to the application later</li>
              </ul>
              <div className="text-xs text-gray-500">
                Storage Key: civicEmbeddedWalletAddress
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Connect your wallet using the "Connect Wallet" button</li>
              <li>If you don't have an embedded wallet, create one</li>
              <li>Navigate to the home page and back - notice the wallet stays connected</li>
              <li>Refresh the page - wallet connection persists</li>
              <li>Open browser dev tools and check localStorage for 'civicEmbeddedWalletAddress'</li>
              <li>Check browser console for backend registration logs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 