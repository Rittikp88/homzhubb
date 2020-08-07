import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  postLeaseLead: (propertyTermId: number): string => `lease-listings/${propertyTermId}/lead/`,
  postSaleLead: (propertyTermId: number): string => `sale-listings/${propertyTermId}/lead/`,
};

class LeadRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  // TODO: Need to verify return body and type after signup flow
  public postLeaseLeadDetail = async (payload: ILeadPayload): Promise<any> => {
    const { propertyTermId, data } = payload;
    return await this.apiClient.post(ENDPOINTS.postLeaseLead(propertyTermId), data);
  };

  // TODO: Need to verify return body and type after signup flow
  public postSaleLeadDetail = async (payload: ILeadPayload): Promise<any> => {
    const { propertyTermId, data } = payload;
    return await this.apiClient.post(ENDPOINTS.postSaleLead(propertyTermId), data);
  };
}

const leadRepository = new LeadRepository();
export { leadRepository as LeadRepository };