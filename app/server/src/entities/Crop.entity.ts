import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { CropType, CropStatus } from "./enums/CropEnums";
import { User } from "./User.entity";
import { Investment } from "./Investment.entity";
import { AssetUpdate } from "./AssetUpdate.entity";
import { ContractEvent } from "./ContractEvent.entity";

@Entity("assets")
export class Asset extends BaseEntity {
    @Column({ type: "enum", enum: CropType })
    assetType!: CropType;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    pricePerUnit!: number;

    @Column({ type: "timestamp" })
    expectedHarvestDate!: Date;

    @Column({ type: "timestamp" })
    expectedDeliveryDate!: Date;

    @Column({ type: "enum", enum: CropStatus, default: CropStatus.PENDING })
    status!: CropStatus;

    @Column({ nullable: true })
    tokenContractAddress?: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    fundedAmount!: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    fundedPercentage!: number;

    @Column({ type: "jsonb" })
    location!: {
        latitude: number;
        longitude: number;
        address: string;
        region?: string;
    };

    @Column({ type: "jsonb", nullable: true })
    weatherData?: Record<string, any>;

    // Relationships
    @Column()
    producerWalletAddress!: string;

    @OneToMany(() => Investment, (investment) => investment.asset)
    investments!: Investment[];

    @OneToMany(() => AssetUpdate, (update) => update.asset)
    updates!: AssetUpdate[];

    @OneToMany(() => ContractEvent, (event) => event.relatedAsset)
    contractEvents!: ContractEvent[];

    // Calculated fields
    getTotalValue(): number {
        return Number(this.quantity) * Number(this.pricePerUnit);
    }

    getRemainingFunding(): number {
        return this.getTotalValue() - Number(this.fundedAmount);
    }
}
