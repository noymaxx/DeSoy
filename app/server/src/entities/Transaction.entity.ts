import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { TransactionType, TransactionStatus } from './enums/TransactionEnums';
import { User } from './User.entity';
import { Asset } from './Crop.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tokenAmount?: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status!: TransactionStatus;

  @Column({ nullable: true })
  blockchainTransactionHash?: string;

  @Column({ type: 'jsonb', nullable: true })
  contractData?: {
    contractAddress: string;
    functionName: string;
    params: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Gas and network information
  @Column({ type: 'jsonb', nullable: true })
  networkData?: {
    chainId: number;
    gasPrice: string;
    gasUsed: string;
    blockNumber: number;
  };

  // Relationships
  @ManyToOne(() => User, user => user.sentTransactions)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @Column()
  fromUserId!: string;

  @ManyToOne(() => User, user => user.receivedTransactions)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @Column()
  toUserId!: string;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'assetId' })
  relatedAsset?: Asset;

  @Column({ nullable: true })
  assetId?: string;
} 