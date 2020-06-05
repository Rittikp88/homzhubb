import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ICreateAssetDetails, ICreateAssetResult } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getPropertyDetails: (): string => 'asset-groups/',
  createAsset: (): string => 'assets/',
  getRentServices: (): string => 'services/',
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<IPropertyDetailsData[]> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyDetails());
  };

  public createAsset = async (assetDetails: ICreateAssetDetails): Promise<ICreateAssetResult> => {
    return await this.apiClient.post(ENDPOINTS.createAsset(), assetDetails);
  };

  public getRentServices = async (): Promise<IRentServiceList[]> => {
    return await this.apiClient.get(ENDPOINTS.getRentServices());
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
