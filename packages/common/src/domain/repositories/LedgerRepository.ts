import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IAddGeneralLedgerPayload,
  ICreateLedgerResult,
  IGeneralLedgerPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

const ENDPOINTS = {
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
  getLedgerCategories: (): string => 'general-ledger-categories/',
  postLedgers: (): string => 'general-ledgers/',
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

  public getLedgerCategories = async (): Promise<LedgerCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getLedgerCategories());
    return ObjectMapper.deserializeArray(LedgerCategory, response);
  };

  public postGeneralLedgers = async (payload: IAddGeneralLedgerPayload): Promise<ICreateLedgerResult> => {
    return await this.apiClient.post(ENDPOINTS.postLedgers(), payload);
  };
}

const ledgerRepository = new LedgerRepository();
export { ledgerRepository as LedgerRepository };
