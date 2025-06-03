import { Request, Response } from 'express';
import { AssetService } from '../services/asset.service';
import { asyncHandler } from '../utils/asyncHandler';
import { createError } from '../utils/errorHandler';
import { AssetStatus } from '../entities/enums/AssetEnums';

const assetService = new AssetService();

export class AssetController {
  createAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const producerId = req.user?.id;
    
    if (!producerId) {
      throw createError('Unauthorized', 403);
    }
    
    const asset = await assetService.createAsset({
      ...req.body,
      producerId
    });
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });
  });

  getAssetById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const asset = await assetService.getAssetById(id);
    
    res.status(200).json({
      success: true,
      message: 'Asset retrieved successfully',
      data: asset
    });
  });

  updateAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const producerId = req.user?.id;
    
    if (!producerId) {
      throw createError('Unauthorized', 403);
    }
    
    const asset = await assetService.updateAsset(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });
  });

  updateAssetStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, updateData } = req.body;
    const producerId = req.user?.id;
    
    if (!producerId) {
      throw createError('Unauthorized', 403);
    }

    if (!Object.values(AssetStatus).includes(status)) {
      throw createError('Invalid asset status', 400);
    }
    
    const result = await assetService.updateAssetStatus(id, status, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Asset status updated successfully',
      data: result
    });
  });

  listAssets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = req.query;
    
    const assets = await assetService.listAssets(filters);
    
    res.status(200).json({
      success: true,
      message: 'Assets retrieved successfully',
      data: assets
    });
  });

  deleteAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const producerId = req.user?.id;
    
    if (!producerId) {
      throw createError('Unauthorized', 403);
    }
    
    await assetService.deleteAsset(id);
    
    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });
  });
} 