export enum AssetType {
  SOYBEAN = 'soybean',
  CORN = 'corn',
  WHEAT = 'wheat',
  COFFEE = 'coffee',
  COTTON = 'cotton'
}

export enum AssetStatus {
  PENDING = 'pending',
  TOKENIZED = 'tokenized',
  PARTIALLY_FUNDED = 'partially_funded',
  FULLY_FUNDED = 'fully_funded',
  IN_PROGRESS = 'in_progress',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  DELIVERED = 'delivered',
  DEFAULTED = 'defaulted'
}

export enum UpdateType {
  WEATHER = 'weather',
  GROWTH = 'growth',
  PEST_CONTROL = 'pest_control',
  IRRIGATION = 'irrigation',
  FERTILIZATION = 'fertilization',
  HARVEST = 'harvest',
  DELIVERY = 'delivery',
  QUALITY_CHECK = 'quality_check'
}

export enum WeatherEventType {
  RAINFALL = 'rainfall',
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  WIND = 'wind',
  EXTREME_EVENT = 'extreme_event'
} 