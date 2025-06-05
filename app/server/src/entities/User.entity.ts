import { Entity, Column, OneToMany } from "typeorm";
import { IsEmail, MinLength } from "class-validator";
import { Exclude } from "class-transformer";
import { BaseEntity } from "./base/BaseEntity";
import { UserRole, UserStatus, VerificationStatus } from "./enums/UserEnums";
import { Investment } from "../entities/Investment.entity";
import { Transaction } from "../entities/Transaction.entity";

@Entity("users")
export class User extends BaseEntity {
    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @Exclude()
    @MinLength(6)
    password!: string;

    @Column({ unique: true })
    walletAddress!: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.PRODUCER })
    role!: UserRole;

    @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING })
    status!: UserStatus;

    @Column({
        type: "enum",
        enum: VerificationStatus,
        default: VerificationStatus.UNVERIFIED,
    })
    verificationStatus!: VerificationStatus;

    @Column({ nullable: true })
    civicId?: string;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    reputationScore!: number;

    @Column({ type: "jsonb", nullable: true })
    verificationData?: Record<string, any>;

    @Column({ type: "jsonb", nullable: true })
    metadata?: Record<string, any>;

    // Relationships
    // ❌ removed producedAssets because `Asset` no longer has the `producer` relation
    @OneToMany(() => Investment, (investment) => investment.investor)
    investments!: Investment[];

    @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
    sentTransactions!: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.toUser)
    receivedTransactions!: Transaction[];
}
