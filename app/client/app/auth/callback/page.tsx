"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verificar se há parâmetros de erro na URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // Verificar se a sessão foi criada com sucesso
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (session?.user) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            // Redirecionar para a home após 2 segundos
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('No user session found. Please try again.');
          }
        } else {
          setStatus('error');
          setMessage('Failed to verify authentication. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        console.error('Auth callback error:', error);
      }
    };

    // Aguardar um pouco antes de processar para dar tempo da sessão ser criada
    const timer = setTimeout(handleCallback, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

  const handleRetry = () => {
    window.location.href = '/api/auth/signin';
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>

          {status === 'error' && (
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1">
                Go Home
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <Button onClick={handleGoHome} className="w-full">
                Continue to App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 