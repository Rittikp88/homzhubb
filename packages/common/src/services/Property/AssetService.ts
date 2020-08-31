import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

export enum PropertyStatus {
  PENDING = 'PENDING',
}

class AssetService {
  private repository: typeof AssetRepository;

  constructor(repository: typeof AssetRepository) {
    this.repository = repository;
  }

  public getPropertiesByStatus = async (status?: string): Promise<Asset[]> => {
    return await this.repository.getPropertiesByStatus(status);
  };
}

const assetService = new AssetService(AssetRepository);
export { assetService as AssetService };
