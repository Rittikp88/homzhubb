import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  ICreateAssetDetails,
  ICreateAssetResult,
  IUpdateAssetDetails,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IAssetDetails } from '@homzhub/common/src/domain/models/Asset';
import {
  ILeaseTermDetails,
  ICreateLeaseTermDetails,
  IUpdateLeaseTermDetails,
} from '@homzhub/common/src/domain/models/LeaseTerms';
import {
  ICreateSaleTermDetails,
  ISaleDetails,
  IUpdateSaleTermDetails,
} from '@homzhub/common/src/domain/models/SaleTerms';

const ENDPOINTS = {
  getAssetById: (propertyId: number): string => `assets/${propertyId}/`,
  getPropertyDetails: (): string => 'asset-groups/',
  createAsset: (): string => 'assets/',
  updateAsset: (id: number): string => `assets/${id}/`,
  getRentServices: (): string => 'services/',
  leaseTerms: (propertyId: number): string => `assets/${propertyId}/lease-terms/`,
  updateLeaseTerms: (propertyId: number, leaseTermId: number): string =>
    `assets/${propertyId}/lease-terms/${leaseTermId}/`,
  saleTerms: (propertyId: number): string => `assets/${propertyId}/sale-terms/`,
  updateSaleTerms: (propertyId: number, saleTermId: number): string => `assets/${propertyId}/sale-terms/${saleTermId}/`,
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetById = async (propertyId: number): Promise<IAssetDetails> => {
    return this.apiClient.get(ENDPOINTS.getAssetById(propertyId));
  };

  public getDetails = async (): Promise<IPropertyDetailsData[]> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyDetails());
  };

  public createAsset = async (assetDetails: ICreateAssetDetails): Promise<ICreateAssetResult> => {
    return await this.apiClient.post(ENDPOINTS.createAsset(), assetDetails);
  };

  public updateAsset = async (id: number, requestBody: IUpdateAssetDetails): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.updateAsset(id), requestBody);
  };

  public getLeaseTerms = async (propertyId: number): Promise<ILeaseTermDetails[]> => {
    return await this.apiClient.get(ENDPOINTS.leaseTerms(propertyId));
  };

  public createLeaseTerms = async (
    propertyId: number,
    leaseTerms: ICreateLeaseTermDetails
  ): Promise<{ id: number }> => {
    return await this.apiClient.post(ENDPOINTS.leaseTerms(propertyId), leaseTerms);
  };

  public updateLeaseTerms = async (
    propertyId: number,
    leaseTermId: number,
    leaseTerms: IUpdateLeaseTermDetails
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateLeaseTerms(propertyId, leaseTermId), leaseTerms);
  };

  public getSaleTerms = async (propertyId: number): Promise<ISaleDetails[]> => {
    return await this.apiClient.get(ENDPOINTS.saleTerms(propertyId));
  };

  public createSaleTerms = async (propertyId: number, saleTerms: ICreateSaleTermDetails): Promise<{ id: number }> => {
    return await this.apiClient.post(ENDPOINTS.saleTerms(propertyId), saleTerms);
  };

  public updateSaleTerms = async (
    propertyId: number,
    saleTermId: number,
    saleTerms: IUpdateSaleTermDetails
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateSaleTerms(propertyId, saleTermId), saleTerms);
  };

  public getRentServices = async (): Promise<IRentServiceList[]> => {
    return await this.apiClient.get(ENDPOINTS.getRentServices());
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
