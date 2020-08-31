import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { IAddGeneralLedgerPayload, ICreateLedgerResult } from '@homzhub/common/src/domain/repositories/interfaces';
import { GeneralLedgers, DataGroupBy } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

class LedgerService {
  private repository: typeof LedgerRepository;

  constructor(repository: typeof LedgerRepository) {
    this.repository = repository;
  }

  public getAllGeneralLedgers = async (
    startDate: string,
    endDate: string,
    groupLedgerBy: DataGroupBy
  ): Promise<GeneralLedgers[]> => {
    const requestPayload = {
      transaction_date__lte: endDate,
      transaction_date__gte: startDate,
      transaction_date_group_by: groupLedgerBy,
    };

    return await this.repository.getGeneralLedgers(requestPayload);
  };

  public getAllLedgerCategories = async (): Promise<LedgerCategory[]> => {
    return await this.repository.getLedgerCategories();
  };

  public postGeneralLedgers = async (payload: IAddGeneralLedgerPayload): Promise<ICreateLedgerResult> => {
    return await this.repository.postGeneralLedgers(payload);
  };
}

const ledgerService = new LedgerService(LedgerRepository);
export { ledgerService as LedgerService };
