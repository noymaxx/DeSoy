import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { Transaction } from './Transaction.entity';

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 42, unique: true, nullable: false })
  walletAddress!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  civicUserId?: string;

  @Column({ type: 'varchar', nullable: true })
  siweNonce?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  reputationScore!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  sentTransactions!: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.toUser)
  receivedTransactions!: Transaction[];
}

export interface IUser {
  id: string;
  walletAddress: string;
  civicUserId?: string;
  siweNonce?: string;
  reputationScore: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 
