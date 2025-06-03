import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { EventType } from './enums/TransactionEnums';
import { Asset } from './Asset.entity';

@Entity('contract_events')
export class ContractEvent extends BaseEntity {
  @Column()
  contractAddress!: string;

  @Column({ type: 'enum', enum: EventType })
  eventType!: EventType;

  @Column({ type: 'jsonb' })
  eventData!: Record<string, any>;

  @Column()
  blockNumber!: number;

  @Column()
  transactionHash!: string;

  @Column({ type: 'timestamp' })
  blockTimestamp!: Date;

  @Column({ type: 'jsonb', nullable: true })
  decodedData?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Network information
  @Column({ type: 'jsonb' })
  networkInfo!: {
    chainId: number;
    blockHash: string;
    logIndex: number;
  };

  // Relationships
  @ManyToOne(() => Asset, asset => asset.contractEvents)
  @JoinColumn({ name: 'assetId' })
  relatedAsset?: Asset;

  @Column({ nullable: true })
  assetId?: string;
} 