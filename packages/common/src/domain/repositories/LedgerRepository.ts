import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IGeneralLedgerPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

const ENDPOINTS = {
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
};

class LedgerRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getGeneralLedgers = async (requestPayload: IGeneralLedgerPayload): Promise<GeneralLedgers[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getGeneralLedgers(), requestPayload);
    return ObjectMapper.deserializeArray(GeneralLedgers, response);
  };
}

const ledgerRepository = new LedgerRepository();
export { ledgerRepository as LedgerRepository };
