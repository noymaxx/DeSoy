import { Request, Response } from "express";
import { AssetService } from "../services/asset.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../utils/errorHandler";
import { CropStatus } from "../entities/enums/CropEnums";
import { ethers, Interface, toBeHex } from "ethers";
import HarvestLoanManagerABI from "../abi/HarvestLoanManager.json";

const CONTRACT_ADDRESS = "0x8447980CDa681919e96d237E9AA2d5CF369921dB";
const assetService = new AssetService();
const iface = new Interface(HarvestLoanManagerABI);

export class AssetController {
    createAsset = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const userWalletAddress = req.body.walletAddress;

            if (!userWalletAddress) {
                throw createError("Unauthorized", 403);
            }

            console.log("[AssetController] Creating asset in database...");
            const asset = await assetService.createAsset({
                ...req.body,
                producerWalletAddress: userWalletAddress,
            });

            console.log("[AssetController] Asset saved with ID:", asset.id);

            // Generate transaction data
            const expectedReturn = ethers.parseEther("1.0");
            const durationDays = 30;
            const metadataUri = `ipfs://${asset.id}`;

            const data = iface.encodeFunctionData("createProposal", [
                expectedReturn,
                durationDays,
                metadataUri,
            ]);

            const value = toBeHex(ethers.parseEther("0.1"));

            console.log("[AssetController] Transaction data prepared");

            res.status(201).json({
                success: true,
                message:
                    "Asset created. Please sign the transaction in your wallet.",
                data: {
                    asset,
                    transaction: {
                        to: CONTRACT_ADDRESS,
                        value,
                        data,
                    },
                },
            });
        }
    );

    getAssetById = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const asset = await assetService.getAssetById(id);
            res.status(200).json({
                success: true,
                message: "Asset retrieved",
                data: asset,
            });
        }
    );

    updateAsset = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const userWalletAddress = req.body.walletAddress;
            if (!userWalletAddress) throw createError("Unauthorized", 403);
            const asset = await assetService.updateAsset(id, req.body);
            res.status(200).json({
                success: true,
                message: "Asset updated",
                data: asset,
            });
        }
    );

    updateAssetStatus = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const { status, updateData } = req.body;
            const userWalletAddress = req.body.walletAddress;
            if (!userWalletAddress) throw createError("Unauthorized", 403);
            if (!Object.values(CropStatus).includes(status)) {
                throw createError("Invalid asset status", 400);
            }
            const result = await assetService.updateAssetStatus(
                id,
                status,
                updateData
            );
            res.status(200).json({
                success: true,
                message: "Status updated",
                data: result,
            });
        }
    );

    listAssets = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const filters = req.query;
            const assets = await assetService.listAssets(filters);
            res.status(200).json({
                success: true,
                message: "Assets listed",
                data: assets,
            });
        }
    );

    deleteAsset = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const userWalletAddress = req.body.walletAddress;
            if (!userWalletAddress) throw createError("Unauthorized", 403);
            await assetService.deleteAsset(id);
            res.status(200).json({ success: true, message: "Asset deleted" });
        }
    );
}
