import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';

class LedgerUtils {
  // Filter the data by CREDIT or DEBIT
  public filterByType = <D extends { entryType: string | T }, T>(type: T, data: D[]): D[] => {
    return data.filter((ledger: D) => ledger.entryType === type);
  };

  public groupByMonth = (data: GeneralLedgers[]): { [key: string]: GeneralLedgers[] } => {
    const groupedEntity: { [key: string]: GeneralLedgers[] } = {};

    data.forEach((ledger: GeneralLedgers) => {
      if (groupedEntity[ledger.transactionDateLabel]) {
        groupedEntity[ledger.transactionDateLabel].push(ledger);
        return;
      }
      groupedEntity[ledger.transactionDateLabel] = [ledger];
    });

    return groupedEntity;
  };

  // Sums up the total by CREDIT or DEBIT
  public totalByType = (type: LedgerTypes, data: GeneralLedgers[]): number => {
    const ledgersByCategory: GeneralLedgers[] = this.filterByType<GeneralLedgers, LedgerTypes>(type, data);
    return ledgersByCategory.reduce((accumulator: number, ledger: GeneralLedgers) => accumulator + ledger.amount, 0);
  };
}

const ledgerUtils = new LedgerUtils();
export { ledgerUtils as LedgerUtils };
