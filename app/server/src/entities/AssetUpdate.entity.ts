import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { UpdateType, WeatherEventType } from './enums/CropEnums';
import { Asset } from './Crop.entity';

@Entity('asset_updates')
export class AssetUpdate extends BaseEntity {
  @Column({ type: 'enum', enum: UpdateType })
  type!: UpdateType;

  @Column({ type: 'timestamp' })
  updateDate!: Date;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @Column({ nullable: true })
  oracleTransactionHash?: string;

  @Column({ type: 'enum', enum: WeatherEventType, nullable: true })
  weatherEventType?: WeatherEventType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Oracle verification
  @Column({ nullable: true })
  oracleSignature?: string;

  @Column({ type: 'jsonb', nullable: true })
  oracleData?: {
    provider: string;
    timestamp: string;
    signature: string;
    data: Record<string, any>;
  };

  // Relationships
  @ManyToOne(() => Asset, asset => asset.updates)
  @JoinColumn({ name: 'assetId' })
  asset!: Asset;

  @Column()
  assetId!: string;
} 