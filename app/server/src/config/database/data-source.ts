import { DataSource } from 'typeorm';
import { User } from '../../entities/User.entity';
import { Asset } from '../../entities/Asset.entity';
import { Investment } from '../../entities/Investment.entity';
import { Transaction } from '../../entities/Transaction.entity';
import { AssetUpdate } from '../../entities/AssetUpdate.entity';
import { ContractEvent } from '../../entities/ContractEvent.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'delasoja',
  password: process.env.DB_PASSWORD || 'delasoja',
  database: process.env.DB_NAME || 'delasoja',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    User,
    Asset,
    Investment,
    Transaction,
    AssetUpdate,
    ContractEvent
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
}); 