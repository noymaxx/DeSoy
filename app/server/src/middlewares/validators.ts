import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errorHandler';
import { AssetStatus, AssetType } from '../entities/enums/AssetEnums';
import { InvestmentStatus } from '../entities/enums/TransactionEnums';

/**
 * Interface for validation rules
 */
interface ValidationRules {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    message?: string;
    enum?: any;
  };
}

/**
 * Data validation middleware
 */
export const validate = (rules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    
    Object.entries(rules).forEach(([field, rule]) => {
      const value = req.body[field];
      
      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || `The field '${field}' is required`);
        return;
      }
      
      // Skip if not required and empty
      if (value === undefined || value === null || value === '') {
        return;
      }
      
      // Check type
      if (rule.type && typeof value !== rule.type) {
        errors.push(rule.message || `The field '${field}' must be of type ${rule.type}`);
      }
      
      // Check min length
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push(rule.message || `The field '${field}' must have at least ${rule.minLength} characters`);
      }
      
      // Check max length
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push(rule.message || `The field '${field}' must have at most ${rule.maxLength} characters`);
      }
      
      // Check pattern
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(rule.message || `The field '${field}' has an invalid format`);
      }
      
      // Check enum values
      if (rule.enum && !Object.values(rule.enum).includes(value)) {
        errors.push(rule.message || `The field '${field}' must be one of: ${Object.values(rule.enum).join(', ')}`);
      }
      
      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.message || `The field '${field}' is invalid`);
      }
    });
    
    if (errors.length > 0) {
      next(createError(errors.join('. '), 400));
      return;
    }
    
    next();
  };
};

/**
 * Asset validations
 */
export const assetValidations = {
  createAsset: validate({
    assetType: {
      required: true,
      type: 'string',
      enum: AssetType,
      message: 'Asset type is required and must be valid'
    },
    quantity: {
      required: true,
      type: 'number',
      custom: (value) => value > 0,
      message: 'Quantity must be a positive number'
    },
    pricePerUnit: {
      required: true,
      type: 'number',
      custom: (value) => value > 0,
      message: 'Price per unit must be a positive number'
    },
    expectedHarvestDate: {
      required: true,
      custom: (value) => !isNaN(Date.parse(value)),
      message: 'Expected harvest date must be a valid date'
    },
    expectedDeliveryDate: {
      required: true,
      custom: (value) => !isNaN(Date.parse(value)),
      message: 'Expected delivery date must be a valid date'
    },
    location: {
      required: true,
      type: 'object',
      custom: (value) => {
        return (
          typeof value.latitude === 'number' &&
          typeof value.longitude === 'number' &&
          typeof value.address === 'string' &&
          value.address.length > 0
        );
      },
      message: 'Location must include valid latitude, longitude, and address'
    }
  }),

  updateAsset: validate({
    assetType: {
      type: 'string',
      enum: AssetType,
      message: 'Asset type must be valid'
    },
    quantity: {
      type: 'number',
      custom: (value) => value > 0,
      message: 'Quantity must be a positive number'
    },
    pricePerUnit: {
      type: 'number',
      custom: (value) => value > 0,
      message: 'Price per unit must be a positive number'
    },
    expectedHarvestDate: {
      custom: (value) => !isNaN(Date.parse(value)),
      message: 'Expected harvest date must be a valid date'
    },
    expectedDeliveryDate: {
      custom: (value) => !isNaN(Date.parse(value)),
      message: 'Expected delivery date must be a valid date'
    }
  }),

  updateStatus: validate({
    status: {
      required: true,
      type: 'string',
      enum: AssetStatus,
      message: 'Status must be valid'
    },
    updateData: {
      required: true,
      type: 'object',
      message: 'Update data is required'
    }
  })
};

/**
 * Investment validations
 */
export const investmentValidations = {
  createInvestment: validate({
    assetId: {
      required: true,
      type: 'string',
      message: 'Asset ID is required'
    },
    amount: {
      required: true,
      type: 'number',
      custom: (value) => value > 0,
      message: 'Investment amount must be a positive number'
    }
  }),

  updateInvestment: validate({
    status: {
      type: 'string',
      enum: InvestmentStatus,
      message: 'Investment status must be valid'
    },
    amount: {
      type: 'number',
      custom: (value) => value > 0,
      message: 'Investment amount must be a positive number'
    }
  })
}; 