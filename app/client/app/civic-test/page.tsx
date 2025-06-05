"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CivicTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string>("");

  const handleCivicLogin = async () => {
    setIsLoading(true);
    setLoginStatus("Attempting Civic login...");
    
    try {
      // O padrão [...civicauth] captura qualquer coisa após /api/auth/
      // Vamos testar com diferentes caminhos
      const authRoutes = [
        "/api/auth/civicauth/signin",
        "/api/auth/civicauth/login", 
        "/api/auth/civicauth/callback"
      ];

      setLoginStatus("Testing auth routes with [...civicauth] pattern");
      
      // Redirecionar para a primeira opção
      window.location.href = authRoutes[0];
      
    } catch (error) {
      console.error("Civic login error:", error);
      setLoginStatus("Error during login attempt: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setIsLoading(true);
    setLoginStatus("Testing auth endpoints...");
    
    try {
      // Testar diferentes endpoints
      const endpoints = [
        "/api/auth/civicauth/test",
        "/api/auth/civicauth",
        "/api/auth/challenge"
      ];

      let results = [];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "OPTIONS", // Usando OPTIONS que adicionamos
          });
          
          if (response.ok) {
            const data = await response.text();
            results.push(`✅ ${endpoint}: ${response.status} - ${data.substring(0, 100)}`);
          } else {
            results.push(`❌ ${endpoint}: ${response.status} - ${response.statusText}`);
          }
        } catch (err) {
          results.push(`❌ ${endpoint}: Network error - ${err}`);
        }
      }
      
      setLoginStatus(results.join('\n\n'));
    } catch (error) {
      setLoginStatus(`Network error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">
            🧪 Civic Auth Test Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Server running on <strong>port 3001</strong>
              <br />
              Testing Civic integration with [...civicauth] route pattern
            </p>
          </div>

          <Button 
            onClick={testAuthEndpoint}
            disabled={isLoading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isLoading ? "Testing..." : "🔍 Test Auth Endpoints"}
          </Button>

          <Button 
            onClick={handleCivicLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Loading..." : "🚀 Test Civic Redirect"}
          </Button>

          {loginStatus && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md max-h-64 overflow-y-auto">
              <p className="text-xs text-blue-800 whitespace-pre-wrap font-mono">{loginStatus}</p>
            </div>
          )}

          <div className="text-center pt-4">
            <a 
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Voltar para a home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 