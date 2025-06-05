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

    // Send the POST request to the backend using fetch
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': data.walletAddress,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: "Asset created successfully",
      data: responseData
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create asset",
      error: error.message
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
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'x-wallet-address': walletAddress,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: responseData
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch assets",
      error: error.message
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'x-wallet-address': walletAddress,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: responseData
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch asset",
      error: error.message
    };
  }
}; 