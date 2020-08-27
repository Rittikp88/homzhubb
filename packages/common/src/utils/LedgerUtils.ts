import { sumBy } from 'lodash';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';

class LedgerUtils {
  public getLedgerDataOfType = (type: LedgerTypes, data: GeneralLedgers[]): GeneralLedgers[] => {
    return data.filter((ledger: GeneralLedgers) => ledger.entryType === type);
  };

  public getAllTransactionsOfType = (type: LedgerTypes, data: GeneralLedgers[]): number[] => {
    const category: GeneralLedgers[] = this.getLedgerDataOfType(type, data);
    return [sumBy(category, (ledger: GeneralLedgers) => ledger.amount)];
  };

  public getSumOfTransactionsOfType = (type: LedgerTypes, data: GeneralLedgers[]): number => {
    return this.getAllTransactionsOfType(type, data).reduce((accumulator, currentValue) => accumulator + currentValue);
  };
}

const ledgerUtils = new LedgerUtils();
export { ledgerUtils as LedgerUtils };
