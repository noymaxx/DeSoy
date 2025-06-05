import axios from 'axios';

interface CreateAssetDTO {
  assetType: string;
  quantity: number;
  pricePerUnit: number;
  expectedHarvestDate: string;
  expectedPaymentDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    region?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class AssetService {
  private static instance: AssetService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/assets`;
  }

  public static getInstance(): AssetService {
    if (!AssetService.instance) {
      AssetService.instance = new AssetService();
    }
    return AssetService.instance;
  }

  async createAsset(data: CreateAssetDTO) {
    try {
      const response = await axios.post(this.baseUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create asset');
    }
  }

  async getAssets() {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assets');
    }
  }

  async getAssetById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch asset');
    }
  }
} 