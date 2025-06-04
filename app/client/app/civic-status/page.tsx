"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

export default function CivicStatusPage() {
  const integrationStatus = [
    {
      item: "Next.js Plugin Configured",
      status: "complete",
      description: "createCivicAuthPlugin added to next.config.mjs"
    },
    {
      item: "API Routes Fixed",
      status: "complete", 
      description: "/api/auth/[...nextauth]/route.ts implemented (conflict resolved)"
    },
    {
      item: "Middleware Configured",
      status: "complete",
      description: "Auth middleware added (currently not protecting routes)"
    },
    {
      item: "CivicAuthProvider Added",
      status: "complete",
      description: "Layout wrapped with provider"
    },
    {
      item: "Custom Hook Created",
      status: "complete",
      description: "useCivic hook for auth management"
    },
    {
      item: "Header Integration",
      status: "complete",
      description: "Connect Wallet button integrated with Civic"
    },
    {
      item: "Callback Page",
      status: "complete",
      description: "Auth callback handling implemented"
    },
    {
      item: "Server Running",
      status: "complete",
      description: "Next.js server running without route conflicts"
    },
    {
      item: "Environment Variables",
      status: "pending",
      description: "Need to configure .env.local with AUTH_SECRET"
    }
  ];

  const testRoutes = [
    {
      name: "Test Page",
      url: "/civic-test",
      description: "Test authentication flow"
    },
    {
      name: "Auth Callback",
      url: "/auth/callback",
      description: "Authentication callback handler"
    },
    {
      name: "NextAuth API", 
      url: "/api/auth/signin",
      description: "Civic auth signin endpoint"
    },
    {
      name: "Session API",
      url: "/api/auth/session",
      description: "Check current session"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏛️ Civic Integration Status
          </h1>
          <p className="text-gray-600">
            deSoy - Rural Credit DeFi Platform
          </p>
          <div className="mt-2">
            <Badge className="bg-green-100 text-green-800">
              ✅ Route Conflict Resolved - Server Running
            </Badge>
          </div>
        </div>

        {/* Integration Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Test Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {testRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{route.name}</p>
                    <p className="text-sm text-gray-600">{route.description}</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {route.url}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(route.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Route Conflicts Resolved</h4>
                <p className="text-sm text-green-700 mt-1">
                  Removed conflicting <code>[...civicauth]</code> route, using <code>[...nextauth]</code> with Civic handlers
                </p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Environment Configuration</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Create <code>.env.local</code> file with AUTH_SECRET and other Civic configuration
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Test Authentication Flow</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Use the test page and "Connect Wallet" button to verify the complete authentication flow
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">Smart Contract Integration</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Next: Create UserManager.sol contract for on-chain identity verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.href = '/civic-test'}>
            Test Integration
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Try Connect Wallet
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to App
          </Button>
        </div>
      </div>
    </div>
  );
} 