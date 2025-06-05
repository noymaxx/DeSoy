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
  walletAddress: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = `${API_URL}/api/assets`;

/**
 * Creates a new asset with the provided data and wallet address.
 * @param data - The asset data including type, quantity, price, dates, and location.
 * @returns A success or error response with the created asset data.
 */
export const createAsset = async (data: CreateAssetDTO): Promise<ApiResponse<any>> => {
  try {
    // Validate required fields
    if (!data.assetType || !data.quantity || !data.pricePerUnit || !data.expectedHarvestDate || !data.expectedPaymentDate) {
      throw new Error("Missing required fields: assetType, quantity, pricePerUnit, expectedHarvestDate, or expectedPaymentDate");
    }

    if (!data.location.latitude || !data.location.longitude || !data.location.address) {
      throw new Error("Missing required location fields: latitude, longitude, or address");
    }

    // Send the POST request to the backend
    const response = await axios.post(API_BASE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': data.walletAddress,
      }
    });

    return {
      success: true,
      message: "Asset created successfully",
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create asset",
      error: error.response?.data || error.message
    };
  }
};

/**
 * Fetches all assets associated with the given wallet address.
 * @param walletAddress - The wallet address to fetch assets for.
 * @returns A list of assets or an error response.
 */
export const getAssets = async (walletAddress: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        'x-wallet-address': walletAddress,
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch assets",
      error: error.response?.data || error.message
    };
  }
};

/**
 * Fetches a specific asset by its ID.
 * @param id - The ID of the asset to fetch.
 * @param walletAddress - The wallet address of the requester.
 * @returns The asset data or an error response.
 */
export const getAssetById = async (id: string, walletAddress: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        'x-wallet-address': walletAddress,
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch asset",
      error: error.response?.data || error.message
    };
  }
}; 