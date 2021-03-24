import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ProspectProfile } from '@homzhub/common/src/domain/models/ProspectProfile';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IUpdateProspectProfile } from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  prospects: 'prospects/',
  tenantTypes: 'list-of-values/prospect-tenant-types/',
  jobTypes: 'list-of-values/user-employer-job-types/',
};

class OffersRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getProspectsInfo = async (): Promise<ProspectProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.prospects);
    return ObjectMapper.deserialize(ProspectProfile, response);
  };

  public getTenantTypes = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.tenantTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getJobType = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.jobTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public updateProspects = async (body: IUpdateProspectProfile): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.prospects, body);
  };
}

const offersRepository = new OffersRepository();
export { offersRepository as OffersRepository };
