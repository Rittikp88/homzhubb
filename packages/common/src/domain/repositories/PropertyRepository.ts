import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Society } from '@homzhub/common/src/domain/models/Society';
import {
  IAssetSocietyPayload,
  ISocietyParam,
  ISocietyPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  societies: 'v1/societies/',
  societyById: (id: number): string => `v1/societies/${id}/`,
  assetSociety: (id: number): string => `v1/societies/${id}/assets/`,
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocieties = async (param?: ISocietyParam): Promise<Society[]> => {
    const response = await this.apiClient.get(ENDPOINTS.societies, param);
    return ObjectMapper.deserializeArray(Society, response);
  };

  public createSociety = async (payload: ISocietyPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.societies, payload);
  };

  public deleteSociety = async (societyId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.societyById(societyId));
  };

  public updateSociety = async (societyId: number, body: ISocietyPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.societyById(societyId), body);
  };

  public getSociety = async (societyId: number): Promise<Society> => {
    const response = await this.apiClient.get(ENDPOINTS.societyById(societyId));
    return ObjectMapper.deserialize(Society, response);
  };

  public addAssetSociety = async (payload: IAssetSocietyPayload): Promise<void> => {
    const { societyId, body } = payload;
    return await this.apiClient.post(ENDPOINTS.assetSociety(societyId), body);
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
