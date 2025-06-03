import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database/data-source';
import { Asset } from '../entities/Asset.entity';
import { AssetUpdate } from '../entities/AssetUpdate.entity';
import { AssetStatus } from '../entities/enums/AssetEnums';
import { createError } from '../utils/errorHandler';

export class AssetService {
  private assetRepository: Repository<Asset>;
  private assetUpdateRepository: Repository<AssetUpdate>;

  constructor() {
    this.assetRepository = AppDataSource.getRepository(Asset);
    this.assetUpdateRepository = AppDataSource.getRepository(AssetUpdate);
  }

  async createAsset(data: Partial<Asset>): Promise<Asset> {
    try {
      const asset = this.assetRepository.create({
        ...data,
        status: AssetStatus.PENDING,
        fundedAmount: 0,
        fundedPercentage: 0
      });

      return await this.assetRepository.save(asset);
    } catch (error) {
      throw createError('Failed to create asset', 500);
    }
  }

  async getAssetById(id: string): Promise<Asset> {
    try {
      const asset = await this.assetRepository.findOne({
        where: { id },
        relations: ['producer', 'investments', 'updates']
      });

      if (!asset) {
        throw createError('Asset not found', 404);
      }

      return asset;
    } catch (error) {
      throw createError('Failed to fetch asset', 500);
    }
  }

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    try {
      const asset = await this.getAssetById(id);
      
      Object.assign(asset, data);
      
      return await this.assetRepository.save(asset);
    } catch (error) {
      throw createError('Failed to update asset', 500);
    }
  }

  async updateAssetStatus(id: string, status: AssetStatus, updateData: Record<string, any>): Promise<{ asset: Asset; update: AssetUpdate }> {
    try {
      const asset = await this.getAssetById(id);
      
      asset.status = status;
      await this.assetRepository.save(asset);

      const assetUpdate = this.assetUpdateRepository.create({
        assetId: id,
        data: updateData
      });
      await this.assetUpdateRepository.save(assetUpdate);

      return { asset, update: assetUpdate };
    } catch (error) {
      throw createError('Failed to update asset status', 500);
    }
  }

  async listAssets(filters: {
    status?: AssetStatus;
    producerId?: string;
    minFundedPercentage?: number;
  }): Promise<Asset[]> {
    try {
      const queryBuilder = this.assetRepository
        .createQueryBuilder('asset')
        .leftJoinAndSelect('asset.producer', 'producer')
        .leftJoinAndSelect('asset.investments', 'investments');

      if (filters.status) {
        queryBuilder.andWhere('asset.status = :status', { status: filters.status });
      }

      if (filters.producerId) {
        queryBuilder.andWhere('asset.producerId = :producerId', { producerId: filters.producerId });
      }

      if (filters.minFundedPercentage) {
        queryBuilder.andWhere('asset.fundedPercentage >= :minFundedPercentage', {
          minFundedPercentage: filters.minFundedPercentage
        });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw createError('Failed to fetch assets', 500);
    }
  }

  async deleteAsset(id: string): Promise<void> {
    try {
      const asset = await this.getAssetById(id);
      await this.assetRepository.remove(asset);
    } catch (error) {
      throw createError('Failed to delete asset', 500);
    }
  }
} 