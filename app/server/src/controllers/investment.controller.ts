import { Request, Response } from "express";
import { InvestmentService } from "../services/investment.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../utils/errorHandler";

const investmentService = new InvestmentService();

export class InvestmentController {
    createInvestment = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const investorId = req.body.walletAddress as string;

            if (!investorId) {
                throw createError("Unauthorized", 403);
            }

            const result = await investmentService.createInvestment({
                ...req.body,
                investorId,
            });

            res.status(201).json({
                success: true,
                message: "Investment created successfully",
                data: result,
            });
        }
    );

    getInvestmentById = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const investorId = req.body.walletAddress as string;

            if (!investorId) {
                throw createError("Unauthorized", 403);
            }

            const investment = await investmentService.getInvestmentById(id);

            // Check if user is the investor or the asset producer
            if (
                investment.investorId !== investorId &&
                investment.asset.producerWalletAddress !== investorId
            ) {
                throw createError("Unauthorized", 403);
            }

            res.status(200).json({
                success: true,
                message: "Investment retrieved successfully",
                data: investment,
            });
        }
    );

    updateInvestment = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const investorId = req.body.walletAddress as string;

            if (!investorId) {
                throw createError("Unauthorized", 403);
            }

            const investment = await investmentService.getInvestmentById(id);

            // Only investor can update their investment
            if (investment.investorId !== investorId) {
                throw createError("Unauthorized", 403);
            }

            const updatedInvestment = await investmentService.updateInvestment(
                id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: "Investment updated successfully",
                data: updatedInvestment,
            });
        }
    );

    listInvestments = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const userId = req.body.walletAddress as string;

            if (!userId) {
                throw createError("Unauthorized", 403);
            }

            const filters = {
                ...req.query,
                investorId: userId, // Only show user's investments
            };

            const investments = await investmentService.listInvestments(
                filters
            );

            res.status(200).json({
                success: true,
                message: "Investments retrieved successfully",
                data: investments,
            });
        }
    );

    deleteInvestment = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const investorId = req.body.walletAddress as string;

            if (!investorId) {
                throw createError("Unauthorized", 403);
            }

            const investment = await investmentService.getInvestmentById(id);

            // Only investor can delete their investment
            if (investment.investorId !== investorId) {
                throw createError("Unauthorized", 403);
            }

            await investmentService.deleteInvestment(id);

            res.status(200).json({
                success: true,
                message: "Investment deleted successfully",
            });
        }
    );
}
