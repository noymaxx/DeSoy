export enum TransactionType {
  INVESTMENT = 'investment',
  WITHDRAWAL = 'withdrawal',
  DELIVERY_CONFIRMATION = 'delivery_confirmation',
  TOKEN_TRANSFER = 'token_transfer',
  REFUND = 'refund'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REVERTED = 'reverted'
}

export enum InvestmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted'
}

export enum EventType {
  TOKEN_MINTED = 'token_minted',
  TOKEN_TRANSFERRED = 'token_transferred',
  INVESTMENT_MADE = 'investment_made',
  DELIVERY_CONFIRMED = 'delivery_confirmed',
  CONTRACT_UPDATED = 'contract_updated',
  ORACLE_UPDATE = 'oracle_update'
} 