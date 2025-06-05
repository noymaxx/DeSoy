import { createCivicAuthPlugin } from "@civic/auth/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// Aplicar o plugin da Civic ao nextConfig existente
const withCivicAuth = createCivicAuthPlugin({
  clientId: "161a57bc-f60e-462f-ab4b-8652c82936fa",
});

export default withCivicAuth(nextConfig);
