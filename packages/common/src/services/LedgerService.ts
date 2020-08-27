import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { GeneralLedgers, DataGroupBy } from '@homzhub/common/src/domain/models/GeneralLedgers';

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
}

const ledgerService = new LedgerService(LedgerRepository);
export { ledgerService as LedgerService };
