import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IAddGeneralLedgerPayload,
  ICreateLedgerResult,
  IGeneralLedgerPayload,
  IReminderPayload,
  ITransactionParams,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getGeneralLedgers: 'v1/general-ledgers/overall-performances/',
  getLedgerCategories: 'v1/general-ledger-categories/',
  genLedgers: 'v1/general-ledgers/',
  ledger: (id: number): string => `v1/general-ledgers/${id}/`,
  getDues: (): string => 'v1/user-invoices/dues/',
  reminders: 'v1/reminders/',
  reminderCategories: 'v1/reminders/reminder-categories/',
  reminderFrequencies: 'v1/reminders/reminder-frequencies/',
};

class LedgerRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getLedgerPerformances = async (requestPayload: IGeneralLedgerPayload): Promise<GeneralLedgers[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getGeneralLedgers, requestPayload);
    return ObjectMapper.deserializeArray(GeneralLedgers, response);
  };

  public getLedgerCategories = async (): Promise<LedgerCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getLedgerCategories);
    return ObjectMapper.deserializeArray(LedgerCategory, response);
  };

  public postGeneralLedgers = async (payload: IAddGeneralLedgerPayload): Promise<ICreateLedgerResult> => {
    return await this.apiClient.post(ENDPOINTS.genLedgers, payload);
  };

  public updateGeneralLedgers = async (
    payload: IAddGeneralLedgerPayload,
    ledgerId: number
  ): Promise<ICreateLedgerResult> => {
    return await this.apiClient.put(ENDPOINTS.ledger(ledgerId), payload);
  };

  public getGeneralLedgers = async (params: ITransactionParams): Promise<FinancialTransactions> => {
    const response = await this.apiClient.get(ENDPOINTS.genLedgers, params);
    return ObjectMapper.deserialize(FinancialTransactions, response);
  };

  public getLedgerDetails = async (ledgerId: number): Promise<FinancialRecords> => {
    const response = await this.apiClient.get(ENDPOINTS.ledger(ledgerId));
    return ObjectMapper.deserialize(FinancialRecords, response);
  };

  public deleteLedger = async (ledgerId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.ledger(ledgerId));
  };

  public getDues = async (): Promise<Dues> => {
    const response = await this.apiClient.get(ENDPOINTS.getDues());
    return ObjectMapper.deserialize(Dues, response);
  };

  public getReminderCategories = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderCategories);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getReminderFrequencies = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderFrequencies);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public addReminder = async (payload: IReminderPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.reminders, payload);
  };
}

const ledgerRepository = new LedgerRepository();
export { ledgerRepository as LedgerRepository };
