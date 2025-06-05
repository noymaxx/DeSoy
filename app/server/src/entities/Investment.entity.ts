import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { InvestmentStatus } from "./enums/TransactionEnums";
import { User } from "./User.entity";
import { Asset } from "./Crop.entity";

@Entity("investments")
export class Investment extends BaseEntity {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    tokenAmount!: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    investmentPercentage!: number;

    @Column({ type: "timestamp" })
    investmentDate!: Date;

    @Column({
        type: "enum",
        enum: InvestmentStatus,
        default: InvestmentStatus.PENDING,
    })
    status!: InvestmentStatus;

    @Column({ nullable: true })
    transactionHash?: string;

    @Column({ type: "jsonb", nullable: true })
    contractData?: {
        tokenId: string;
        contractAddress: string;
        investorWallet: string;
    };

    @Column({ type: "jsonb", nullable: true })
    metadata?: Record<string, any>;

    @Column()
    investorId!: string;

    @ManyToOne(() => Asset, (asset) => asset.investments)
    @JoinColumn({ name: "assetId" })
    asset!: Asset;

    @Column()
    assetId!: string;

    // Calculated fields
    getExpectedReturn(): number {
        if (!this.asset) return 0;
        return Number(this.tokenAmount) * Number(this.asset.pricePerUnit);
    }

    getPotentialProfit(): number {
        return this.getExpectedReturn() - Number(this.amount);
    }
}
