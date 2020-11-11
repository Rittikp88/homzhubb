import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { DataGroupBy } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export enum DateFilter {
  thisMonth = 1,
  lastMonth = 2,
  thisYear = 3,
  thisFinancialYear = 4,
  lastYear = 5,
  thisWeek = 6,
  lastWeek = 7,
}

export interface IDropdownObject {
  label: string;
  value: DateFilter;
  startDate: string;
  endDate: string;
  dataGroupBy: DataGroupBy;
}

const translationKey = LocaleConstants.namespacesKey.common;

export const FINANCIAL_DROPDOWN_DATA = {
  [DateFilter.thisMonth]: {
    label: `${translationKey}:thisMonth`,
    value: DateFilter.thisMonth,
    startDate: DateUtils.getCurrentMonthStartDate(),
    endDate: DateUtils.getCurrentMonthLastDate(),
    dataGroupBy: DataGroupBy.month,
  },
  [DateFilter.lastMonth]: {
    label: `${translationKey}:lastMonth`,
    value: DateFilter.lastMonth,
    startDate: DateUtils.getPreviousMonthStartDate(),
    endDate: DateUtils.getPreviousMonthLastDate(),
    dataGroupBy: DataGroupBy.month,
  },
  [DateFilter.thisYear]: {
    label: `${translationKey}:thisYear`,
    value: DateFilter.thisYear,
    startDate: DateUtils.getCurrentYearStartDate(),
    endDate: DateUtils.getCurrentDate(),
    dataGroupBy: DataGroupBy.year,
  },
  [DateFilter.thisFinancialYear]: {
    label: `${translationKey}:thisFinancialYear`,
    value: DateFilter.thisFinancialYear,
    startDate: '',
    endDate: '',
    dataGroupBy: DataGroupBy.year,
  },
  [DateFilter.lastYear]: {
    label: `${translationKey}:lastYear`,
    value: DateFilter.lastYear,
    startDate: DateUtils.getPreviousYearStartDate(),
    endDate: DateUtils.getPreviousYearLastDate(),
    dataGroupBy: DataGroupBy.year,
  },
};
