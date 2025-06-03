import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { AssetType, AssetStatus } from './enums/AssetEnums';
import { User } from './User.entity';
import { Investment } from './Investment.entity';
import { AssetUpdate } from './AssetUpdate.entity';
import { ContractEvent } from './ContractEvent.entity';

@Entity('assets')
export class Asset extends BaseEntity {
  @Column({ type: 'enum', enum: AssetType })
  assetType!: AssetType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit!: number;

  @Column({ type: 'timestamp' })
  expectedHarvestDate!: Date;

  @Column({ type: 'timestamp' })
  expectedDeliveryDate!: Date;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.PENDING })
  status!: AssetStatus;

  @Column({ nullable: true })
  tokenContractAddress?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fundedAmount!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  fundedPercentage!: number;

  @Column({ type: 'jsonb' })
  location!: {
    latitude: number;
    longitude: number;
    address: string;
    region?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  weatherData?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Smart contract related fields
  @Column({ type: 'jsonb', nullable: true })
  tokenMetadata?: {
    tokenId: string;
    totalSupply: number;
    decimals: number;
  };

  // Relationships
  @ManyToOne(() => User, user => user.producedAssets)
  @JoinColumn({ name: 'producerId' })
  producer!: User;

  @Column()
  producerId!: string;

  @OneToMany(() => Investment, investment => investment.asset)
  investments!: Investment[];

  @OneToMany(() => AssetUpdate, update => update.asset)
  updates!: AssetUpdate[];

  @OneToMany(() => ContractEvent, event => event.relatedAsset)
  contractEvents!: ContractEvent[];

  // Calculated fields
  getTotalValue(): number {
    return Number(this.quantity) * Number(this.pricePerUnit);
  }

  getRemainingFunding(): number {
    return this.getTotalValue() - Number(this.fundedAmount);
  }
} 