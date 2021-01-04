import { TFunction } from 'i18next';
import { DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';

import {
  DateFilter,
  DateRangeType,
  FINANCIAL_DROPDOWN_DATA,
  IDropdownObject,
} from '@homzhub/common/src/constants/FinanceOverview';

export interface IGraphProps {
  data1: number[];
  data2: number[];
  label: string[];
  type: DateRangeType;
}

export interface IGeneralLedgersParams {
  selectedTimeRange: DateFilter;
  financialYear: {
    startDate: string;
    endDate: string;
    startMonthIndex: number;
    endMonthIndex: number;
  };
  selectedCountry?: number | undefined;
  selectedProperty?: number | undefined;
}

export class FinanceUtils {
  private params: IGeneralLedgersParams;

  private data: GeneralLedgers[];

  constructor(
    selectedTimeRange: DateFilter,
    financialYear: { startDate: string; endDate: string; startMonthIndex: number; endMonthIndex: number },
    data: GeneralLedgers[],
    selectedCountry?: number,
    selectedProperty?: number
  ) {
    this.data = data;
    this.params = {
      selectedCountry,
      selectedProperty,
      financialYear,
      selectedTimeRange,
    };
  }

  public updateData = (
    selectedTimeRange: DateFilter,
    financialYear: { startDate: string; endDate: string; startMonthIndex: number; endMonthIndex: number },
    data: GeneralLedgers[],
    selectedCountry?: number,
    selectedProperty?: number
  ): void => {
    this.data = data;
    this.params = {
      selectedCountry,
      selectedProperty,
      financialYear,
      selectedTimeRange,
    };
  };

  public renderCalenderLabel = (selectedTimeRange: DateFilter): string => {
    switch (selectedTimeRange) {
      case DateFilter.thisYear:
        return DateUtils.getCurrentYear();
      case DateFilter.lastMonth:
        return DateUtils.getLastMonth();
      case DateFilter.lastYear:
        return DateUtils.getLastYear();
      case DateFilter.thisFinancialYear: {
        const { startDate, endDate, startMonthIndex, endMonthIndex } = this.params.financialYear;

        const startMonth = MonthNames[startMonthIndex];
        const startYear = startDate.split('-')[0];
        const endMonth = MonthNames[endMonthIndex];
        const endYear = endDate.split('-')[0];

        return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
      }
      default:
        return DateUtils.getCurrentMonth();
    }
  };

  public renderFilterOptions = (t: TFunction): IDropdownObject[] => {
    const data = Object.values(FINANCIAL_DROPDOWN_DATA);

    return data.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
      };
    });
  };

  public getBarGraphData = (selectedTimeRange: DateFilter): IGraphProps => {
    switch (selectedTimeRange) {
      case DateFilter.thisYear:
      case DateFilter.thisFinancialYear:
      case DateFilter.lastYear:
        return this.getGraphDataForYear();
      default:
        return this.getGraphDataForMonth();
    }
  };

  private getGraphDataForYear = (): IGraphProps => {
    const { financialYear, selectedTimeRange } = this.params;
    const { startMonthIndex, endMonthIndex } = financialYear;

    let monthList = MonthNames;
    if (selectedTimeRange === DateFilter.thisFinancialYear) {
      monthList = DateUtils.getMonthRange(startMonthIndex, endMonthIndex);
    }

    let debitArray = new Array(12).fill(0);
    let creditArray = new Array(12).fill(0);

    const dataByMonth = ObjectUtils.groupBy<GeneralLedgers>(this.data, 'transactionDateLabel');
    Object.keys(dataByMonth).forEach((key: string) => {
      const currentMonthData = dataByMonth[key];

      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentMonthData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentMonthData);

      const currentMonth = MonthNames[parseInt(key.split('-')[1], 10) - 1];
      const currentMonthIndex = monthList.findIndex((month) => month === currentMonth);
      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });

    if (selectedTimeRange === DateFilter.thisFinancialYear || selectedTimeRange === DateFilter.thisYear) {
      // Remove every entry in the future
      const currentMonthIndex = monthList.findIndex((month) => month === DateUtils.getCurrentMonthName());
      debitArray = debitArray.slice(0, currentMonthIndex + 1);
      creditArray = creditArray.slice(0, currentMonthIndex + 1);
      monthList = monthList.slice(0, currentMonthIndex + 1);
    }

    return {
      data1: debitArray,
      data2: creditArray,
      label: monthList,
      type: DateRangeType.Year,
    };
  };

  private getGraphDataForMonth = (): IGraphProps => {
    const currentYear = Number(DateUtils.getCurrentYear());
    const requiredMonth =
      this.params.selectedTimeRange === DateFilter.thisMonth
        ? DateUtils.getCurrentMonthIndex()
        : DateUtils.getCurrentMonthIndex() - 1;

    const startingWeekNumber = DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth, 1));
    const lastWeekNumber = DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth + 1, 0));
    let weekCount = lastWeekNumber - startingWeekNumber;
    if (weekCount < 0) {
      weekCount = 0;
    }
    const weekList = new Array(weekCount).fill('');
    const weekListNumber = new Array(weekCount).fill(0);
    for (let i = 0; i < weekCount; i++) {
      weekList[i] = `Week ${i + 1}`;
      weekListNumber[i] = Number(startingWeekNumber) + i;
    }

    const debitArray = new Array(weekCount).fill(0);
    const creditArray = new Array(weekCount).fill(0);
    const dataByWeek = ObjectUtils.groupBy<GeneralLedgers>(this.data, 'transactionDateLabel');

    Object.keys(dataByWeek).forEach((key: string) => {
      const currentWeekData = dataByWeek[key];

      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentWeekData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentWeekData);

      const currentWeek = Number(key.split('-')[1]);
      const currentMonthIndex = weekListNumber.findIndex((week) => week === currentWeek);

      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });

    return {
      data1: debitArray,
      data2: creditArray,
      label: weekList,
      type: DateRangeType.Month,
    };
  };
}
