import { Repository } from "typeorm";
import { AppDataSource } from "../config/database/data-source";
import { Investment } from "../entities/Investment.entity";
import { Asset } from "../entities/Crop.entity";
import { Transaction } from "../entities/Transaction.entity";
import { InvestmentStatus } from "../entities/enums/TransactionEnums";
import { CropStatus } from "../entities/enums/CropEnums";
import { createError } from "../utils/errorHandler";

export class InvestmentService {
    private investmentRepository: Repository<Investment>;
    private assetRepository: Repository<Asset>;
    private transactionRepository: Repository<Transaction>;

    constructor() {
        this.investmentRepository = AppDataSource.getRepository(Investment);
        this.assetRepository = AppDataSource.getRepository(Asset);
        this.transactionRepository = AppDataSource.getRepository(Transaction);
    }

    async createInvestment(data: {
        assetId: string;
        investorId: string;
        amount: number;
    }): Promise<{
        investment: Investment;
        asset: Asset;
        transaction: Transaction;
    }> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const asset = await this.assetRepository.findOneBy({
                id: data.assetId,
            });
            if (!asset) {
                throw createError("Asset not found", 404);
            }

            if (asset.status !== CropStatus.TOKENIZED) {
                throw createError("Asset is not available for investment", 400);
            }

            const totalValue = asset.quantity * asset.pricePerUnit;
            const remainingFunding = totalValue - asset.fundedAmount;

            if (data.amount > remainingFunding) {
                throw createError(
                    "Investment amount exceeds remaining funding needed",
                    400
                );
            }

            // Calculate investment percentage
            const investmentPercentage = (data.amount / totalValue) * 100;

            // Create investment record
            const investment = this.investmentRepository.create({
                assetId: data.assetId,
                investorId: data.investorId,
                amount: data.amount,
                investmentPercentage,
                status: InvestmentStatus.PENDING,
                investmentDate: new Date(),
            });

            await queryRunner.manager.save(investment);

            // Update asset funded amount
            asset.fundedAmount += data.amount;
            asset.fundedPercentage = (asset.fundedAmount / totalValue) * 100;

            if (asset.fundedAmount >= totalValue) {
                asset.status = CropStatus.FULLY_FUNDED;
            } else if (asset.fundedAmount > 0) {
                asset.status = CropStatus.PARTIALLY_FUNDED;
            }

            await queryRunner.manager.save(asset);

            // Create transaction record
            const transaction = this.transactionRepository.create({
                fromUserId: data.investorId,
                toUserId: asset.producerWalletAddress,
                amount: data.amount,
                assetId: data.assetId,
            });

            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();

            return { investment, asset, transaction };
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw createError(
                error.message || "Failed to create investment",
                error.statusCode || 500
            );
        } finally {
            await queryRunner.release();
        }
    }

    async getInvestmentById(id: string): Promise<Investment> {
        try {
            const investment = await this.investmentRepository.findOne({
                where: { id },
                relations: ["investor", "asset"],
            });

            if (!investment) {
                throw createError("Investment not found", 404);
            }

            return investment;
        } catch (error) {
            throw createError("Failed to fetch investment", 500);
        }
    }

    async updateInvestment(
        id: string,
        data: Partial<Investment>
    ): Promise<Investment> {
        try {
            const investment = await this.getInvestmentById(id);

            Object.assign(investment, data);

            return await this.investmentRepository.save(investment);
        } catch (error) {
            throw createError("Failed to update investment", 500);
        }
    }

    async listInvestments(filters: {
        investorId?: string;
        assetId?: string;
        status?: InvestmentStatus;
    }): Promise<Investment[]> {
        try {
            const queryBuilder = this.investmentRepository
                .createQueryBuilder("investment")
                .leftJoinAndSelect("investment.investor", "investor")
                .leftJoinAndSelect("investment.asset", "asset");

            if (filters.investorId) {
                queryBuilder.andWhere("investment.investorId = :investorId", {
                    investorId: filters.investorId,
                });
            }

            if (filters.assetId) {
                queryBuilder.andWhere("investment.assetId = :assetId", {
                    assetId: filters.assetId,
                });
            }

            if (filters.status) {
                queryBuilder.andWhere("investment.status = :status", {
                    status: filters.status,
                });
            }

            return await queryBuilder.getMany();
        } catch (error) {
            throw createError("Failed to fetch investments", 500);
        }
    }

    async deleteInvestment(id: string): Promise<void> {
        try {
            const investment = await this.getInvestmentById(id);
            await this.investmentRepository.remove(investment);
        } catch (error) {
            throw createError("Failed to delete investment", 500);
        }
    }
}
