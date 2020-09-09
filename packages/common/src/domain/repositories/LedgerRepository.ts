import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IAddGeneralLedgerPayload,
  ICreateLedgerResult,
  IGeneralLedgerPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

const ENDPOINTS = {
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
  getLedgerCategories: (): string => 'general-ledger-categories/',
  postLedgers: (): string => 'general-ledgers/',
  getLedgers: (): string => 'general-ledgers/',
};

class LedgerRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getLedgerPerformances = async (requestPayload: IGeneralLedgerPayload): Promise<GeneralLedgers[]> => {
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

  public getGeneralLedgers = async (offset: number, limit: number): Promise<FinancialTransactions> => {
    const response = await this.apiClient.get(ENDPOINTS.getLedgers(), { limit, offset });
    return ObjectMapper.deserialize(FinancialTransactions, response);
  };
}

const ledgerRepository = new LedgerRepository();
export { ledgerRepository as LedgerRepository };
