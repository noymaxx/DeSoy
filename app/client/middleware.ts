import { authMiddleware } from '@civic/auth/nextjs/middleware'

export default authMiddleware();

export const config = {
  // Inicialmente vazio para não afetar rotas existentes
  // Conforme implementarmos páginas que precisam de proteção, adicionaremos aqui
  matcher: [
    // '/civic-test/:path*', // Exemplo: apenas rotas de teste da Civic
    // Deixando comentado para não proteger nada inicialmente
  ],
} 