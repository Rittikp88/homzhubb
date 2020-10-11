import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { DataGroupBy } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const translationKey = LocaleConstants.namespacesKey.common;

export const MISSED_COMPLETED_DATA = {
  [DateFilter.thisWeek]: {
    label: `${translationKey}:thisWeek`,
    value: DateFilter.thisWeek,
    startDate: DateUtils.getCurrentWeekStartDate(DateFormats.ISO),
    endDate: DateUtils.getCurrentWeekLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.week,
  },
  [DateFilter.lastWeek]: {
    label: `${translationKey}:lastWeek`,
    value: DateFilter.lastWeek,
    startDate: DateUtils.getLastWeekStartDate(DateFormats.ISO),
    endDate: DateUtils.getLastWeekLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.week,
  },
  [DateFilter.thisMonth]: {
    label: `${translationKey}:thisMonth`,
    value: DateFilter.thisMonth,
    startDate: DateUtils.getCurrentMonthStartDate(DateFormats.ISO),
    endDate: DateUtils.getCurrentMonthLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.month,
  },
  [DateFilter.lastMonth]: {
    label: `${translationKey}:lastMonth`,
    value: DateFilter.lastMonth,
    startDate: DateUtils.getPreviousMonthStartDate(DateFormats.ISO),
    endDate: DateUtils.getPreviousMonthLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.month,
  },
};

export const UPCOMING_DROPDOWN_DATA = {
  [DateFilter.thisWeek]: {
    label: `${translationKey}:thisWeek`,
    value: DateFilter.thisWeek,
    startDate: DateUtils.getCurrentWeekStartDate(DateFormats.ISO),
    endDate: DateUtils.getCurrentWeekLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.week,
  },
  [DateFilter.thisMonth]: {
    label: `${translationKey}:thisMonth`,
    value: DateFilter.thisMonth,
    startDate: DateUtils.getCurrentMonthStartDate(DateFormats.ISO),
    endDate: DateUtils.getCurrentMonthLastDate(DateFormats.ISO),
    dataGroupBy: DataGroupBy.week,
  },
};
