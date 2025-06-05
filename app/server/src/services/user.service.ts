import { AppDataSource } from '../config/database/data-source';
import { User } from '../entities/User.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

export class UserService {
  // Using definite assignment assertion (!) because initialization is handled
  // in constructor (potentially async) and ensured by ensureRepository()
  private userRepository!: Repository<User>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      console.warn("Data Source not initialized in UserService constructor. Will attempt initialization on demand.");
      // Initialization is better handled centrally at app startup.
      // ensureRepository will handle on-demand initialization if needed.
    } else {
      this.userRepository = AppDataSource.getRepository(User);
    }
  }

  private async ensureRepository(): Promise<Repository<User>> {
    if (!this.userRepository || !AppDataSource.isInitialized) {
      if (!AppDataSource.isInitialized) {
        console.log("Data Source not initialized, attempting to initialize in ensureRepository...");
        try {
          await AppDataSource.initialize();
          console.log("Data Source initialized on demand in ensureRepository.");
        } catch (error) {
          console.error("Failed to initialize Data Source in ensureRepository:", error);
          throw error; // Re-throw to indicate critical failure
        }
      }
      this.userRepository = AppDataSource.getRepository(User);
    }
    return this.userRepository;
  }

  async findOrCreateUserByWalletAddress(walletAddress: string): Promise<User> {
    const repo = await this.ensureRepository();
    const normalizedWalletAddress = walletAddress.toLowerCase();
    let user = await repo.findOneBy({ walletAddress: normalizedWalletAddress });

    if (!user) {
      user = repo.create({ walletAddress: normalizedWalletAddress });
      await repo.save(user);
      console.log(`New user created with wallet address: ${normalizedWalletAddress}`);
    } else {
      console.log(`User found with wallet address: ${normalizedWalletAddress}`);
    }
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    const repo = await this.ensureRepository();
    const normalizedWalletAddress = walletAddress.toLowerCase();
    return repo.findOneBy({ walletAddress: normalizedWalletAddress });
  }

  async getAllUsers(): Promise<User[]> {
    const repo = await this.ensureRepository();
    return repo.find();
  }

  // For updateUser, we might want to allow updating fields other than walletAddress itself.
  // Let's assume for now we might add other updatable fields to User entity later.
  // This example allows updating any partial data of User, but excludes walletAddress from being updated this way.
  async updateUserByWalletAddress(walletAddress: string, updateData: Partial<Omit<User, 'id' | 'walletAddress' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<User | null> {
    const repo = await this.ensureRepository();
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    let user = await repo.findOneBy({ walletAddress: normalizedWalletAddress });

    if (!user) {
      console.log(`User ${normalizedWalletAddress} not found for update.`);
      return null; 
    }

    repo.merge(user, updateData);
    const updatedUser = await repo.save(user); 
    console.log(`User ${normalizedWalletAddress} updated.`);
    return updatedUser;
  }

  async deleteUserByWalletAddress(walletAddress: string): Promise<boolean> {
    const repo = await this.ensureRepository();
    const normalizedWalletAddress = walletAddress.toLowerCase();
    const user = await repo.findOneBy({ walletAddress: normalizedWalletAddress });

    if (!user) {
      console.log(`User ${normalizedWalletAddress} not found for deletion.`);
      return false;
    }

    // If using soft delete (DeleteDateColumn in BaseEntity), TypeORM's remove() or softRemove() is better.
    // For hard delete with a unique column, delete by criteria is fine.
    // If BaseEntity has @DeleteDateColumn, TypeORM handles soft delete with .softDelete() or .save() on an entity with deletedAt set.
    // The current .delete() will perform a hard delete if no soft delete is configured at query level.
    // To ensure soft delete as per BaseEntity, we should use softDelete or load and save.
    // Let's use softRemove for entities that might be loaded.
    // await repo.softRemove(user); // This would be one way if user is loaded.
    // Or, more direct for soft delete by criteria if available and configured:
    const result = await repo.softDelete({ walletAddress: normalizedWalletAddress }); // Assumes softDelete cascades or is handled by TypeORM based on @DeleteDateColumn

    if (result.affected && result.affected > 0) {
      console.log(`User ${normalizedWalletAddress} soft-deleted.`);
      return true;
    }
    console.log(`User ${normalizedWalletAddress} not found or not soft-deleted.`);
    return false;
  }
} 