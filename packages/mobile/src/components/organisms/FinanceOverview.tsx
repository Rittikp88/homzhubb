import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DateFilter, FINANCIAL_DROPDOWN_DATA, IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';

enum TabKeys {
  expenses = 1,
  cashFlow = 2,
}

interface IOwnProps {
  selectedProperty?: number;
  selectedCountry?: number;
}

interface IOwnState {
  currentTab: TabKeys;
  selectedTimeRange: DateFilter;
  data: GeneralLedgers[];
}

interface IStateProps {
  financialYear: { startDate: string; endDate: string; startMonthIndex: number; endMonthIndex: number };
}
type Props = IStateProps & IOwnProps & WithTranslation;

export class FinanceOverview extends React.PureComponent<Props, IOwnState> {
  public state = {
    currentTab: TabKeys.expenses,
    selectedTimeRange: DateFilter.thisYear,
    data: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getGeneralLedgers();
  };

  public componentDidUpdate = async (prevProps: Props): Promise<void> => {
    const { selectedCountry: oldCountry, selectedProperty: oldProperty } = prevProps;
    const { selectedProperty, selectedCountry } = this.props;
    if (selectedProperty !== oldProperty || selectedCountry !== oldCountry) {
      await this.getGeneralLedgers();
    }
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { currentTab, selectedTimeRange, data } = this.state;
    return (
      <View style={styles.container}>
        <OnFocusCallback isAsync callback={this.getGeneralLedgers} />
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('overallPerformance')}
        </Text>
        <SelectionPicker
          data={[
            { title: t('expenses'), value: TabKeys.expenses },
            { title: t('cashFlow'), value: TabKeys.cashFlow },
          ]}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
          testID="financeSelection"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateSection}>
            <Icon name={icons.calendar} size={22} color={theme.colors.darkTint4} />
            <Label numberOfLines={1} style={styles.dateText} type="large" textType="semiBold">
              {this.renderCalenderLabel()}
            </Label>
          </View>
          <Dropdown
            data={this.renderFilterOptions()}
            value={selectedTimeRange}
            // @ts-ignore
            onDonePress={this.onTimeRangeChange}
            listHeight={theme.viewport.height / 2}
            testID="drpTimeRange"
            isOutline
            containerStyle={styles.dropdownStyle}
          />
        </View>
        {currentTab === TabKeys.expenses ? (
          <DonutGraph data={LedgerUtils.filterByType(LedgerTypes.debit, data)} />
        ) : (
          <DoubleBarGraph data={this.getBarGraphData()} />
        )}
      </View>
    );
  };

  public renderCalenderLabel = (): string => {
    const { selectedTimeRange } = this.state;

    switch (selectedTimeRange) {
      case DateFilter.thisYear:
        return DateUtils.getCurrentYear();
      case DateFilter.lastMonth:
        return DateUtils.getLastMonth();
      case DateFilter.lastYear:
        return DateUtils.getLastYear();
      case DateFilter.thisFinancialYear: {
        const {
          financialYear: { startDate, endDate, startMonthIndex, endMonthIndex },
        } = this.props;

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

  public renderFilterOptions = (): IDropdownObject[] => {
    const { t } = this.props;
    const data = Object.values(FINANCIAL_DROPDOWN_DATA);

    return data.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
      };
    });
  };

  private onTabChange = (tabId: TabKeys): void => {
    this.setState({ currentTab: tabId }, () => {
      this.getGeneralLedgers().then();
    });
  };

  private onTimeRangeChange = (selectedTimeRange: number): void => {
    this.setState({ selectedTimeRange }, () => {
      this.getGeneralLedgers().then();
    });
  };

  public getGeneralLedgers = async (): Promise<void> => {
    const {
      selectedCountry,
      selectedProperty,
      financialYear: { endDate: finEndDate, startDate: finStartDate },
    } = this.props;
    const { selectedTimeRange } = this.state;

    // @ts-ignore
    let { endDate, startDate } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];
    // @ts-ignore
    const { value, dataGroupBy } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];

    if (value === DateFilter.thisFinancialYear) {
      endDate = finEndDate;
      startDate = finStartDate;
    }

    try {
      const response: GeneralLedgers[] = await LedgerRepository.getLedgerPerformances({
        transaction_date__gte: startDate,
        transaction_date__lte: endDate,
        transaction_date_group_by: dataGroupBy,
        asset_id: selectedProperty || undefined,
        country_id: selectedCountry || undefined,
      });
      this.setState({ data: response });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  public getBarGraphData = (): { data1: number[]; data2: number[]; label: string[] } => {
    const { selectedTimeRange } = this.state;

    switch (selectedTimeRange) {
      case DateFilter.thisYear:
      case DateFilter.thisFinancialYear:
      case DateFilter.lastYear:
        return this.getGraphDataForYear();
      default:
        return this.getGraphDataForMonth();
    }
  };

  private getGraphDataForYear = (): { data1: number[]; data2: number[]; label: string[] } => {
    const { selectedTimeRange, data } = this.state;
    const {
      financialYear: { startMonthIndex, endMonthIndex },
    } = this.props;

    let monthList = MonthNames;
    if (selectedTimeRange === DateFilter.thisFinancialYear) {
      monthList = DateUtils.getMonthRange(startMonthIndex, endMonthIndex);
    }

    let debitArray = new Array(12).fill(0);
    let creditArray = new Array(12).fill(0);

    const dataByMonth = ObjectUtils.groupBy<GeneralLedgers>(data, 'transactionDateLabel');
    Object.keys(dataByMonth).forEach((key: string) => {
      const currentMonthData = dataByMonth[key];

      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentMonthData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentMonthData);

      const currentMonth = MonthNames[parseInt(key.split('-')[1], 10) - 1];
      const currentMonthIndex = monthList.findIndex((month) => month === currentMonth);
      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });

    // Remove every entry in the future
    const currentMonthIndex = monthList.findIndex((month) => month === DateUtils.getCurrentMonthName());
    debitArray = debitArray.slice(0, currentMonthIndex + 1);
    creditArray = creditArray.slice(0, currentMonthIndex + 1);
    monthList = monthList.slice(0, currentMonthIndex + 1);

    // Remove all trailing 0 values
    const truncateIndex = this.lastNonZeroIndex(debitArray, creditArray);
    if (truncateIndex >= 0) {
      debitArray = debitArray.slice(0, truncateIndex + 1);
      creditArray = creditArray.slice(0, truncateIndex + 1);
      monthList = monthList.slice(0, truncateIndex + 1);
    }

    return {
      data1: debitArray,
      data2: creditArray,
      label: monthList,
    };
  };

  private getGraphDataForMonth = (): { data1: number[]; data2: number[]; label: string[] } => {
    const { selectedTimeRange, data } = this.state;
    const currentYear = Number(DateUtils.getCurrentYear());
    const requiredMonth =
      selectedTimeRange === DateFilter.thisMonth
        ? DateUtils.getCurrentMonthIndex()
        : DateUtils.getCurrentMonthIndex() - 1;

    const startingWeekNumber = DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth, 1));
    const lastWeekNumber = DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth + 1, 0));
    const weekCount = lastWeekNumber - startingWeekNumber;

    let weekList = new Array(weekCount).fill('');
    const weekListNumber = new Array(weekCount).fill(0);
    for (let i = 0; i < weekCount; i++) {
      weekList[i] = `Week ${i + 1}`;
      weekListNumber[i] = Number(startingWeekNumber) + i;
    }

    let debitArray = new Array(weekCount).fill(0);
    let creditArray = new Array(weekCount).fill(0);
    const dataByWeek = ObjectUtils.groupBy<GeneralLedgers>(data, 'transactionDateLabel');

    Object.keys(dataByWeek).forEach((key: string) => {
      const currentWeekData = dataByWeek[key];

      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentWeekData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentWeekData);

      const currentWeek = Number(key.split('-')[1]);
      const currentMonthIndex = weekListNumber.findIndex((week) => week === currentWeek);

      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });

    // Remove every entry in the future
    const currentWeekIndex = weekListNumber.findIndex((weekNo) => weekNo === DateUtils.getISOWeekNumber(new Date()));
    if (currentWeekIndex >= 0) {
      debitArray = debitArray.slice(0, currentWeekIndex + 1);
      creditArray = creditArray.slice(0, currentWeekIndex + 1);
      weekList = weekList.slice(0, currentWeekIndex + 1);
    }

    // Remove all trailing 0 values
    const truncateIndex = this.lastNonZeroIndex(debitArray, creditArray);
    if (truncateIndex >= 0) {
      debitArray = debitArray.slice(0, truncateIndex + 1);
      creditArray = creditArray.slice(0, truncateIndex + 1);
      weekList = weekList.slice(0, truncateIndex + 1);
    }

    return {
      data1: debitArray,
      data2: creditArray,
      label: weekList,
    };
  };

  private lastNonZeroIndex = (debitArray: number[], creditArray: number[]): number => {
    for (let i = debitArray.length - 1; i >= 0; i--) {
      const debit = debitArray[i];
      const credit = creditArray[i];
      if (debit > 0 || credit > 0) return i;
    }

    return -1;
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserFinancialYear } = UserSelector;
  return {
    financialYear: getUserFinancialYear(state),
  };
};

export default connect<IStateProps, {}, {}, IState>(mapStateToProps)(
  withTranslation(LocaleConstants.namespacesKey.assetDashboard)(FinanceOverview)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    backgroundColor: theme.colors.white,
  },
  dateRow: {
    marginTop: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSection: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    marginBottom: 16,
  },
  dateText: {
    flex: 1,
    marginStart: 8,
    color: theme.colors.darkTint4,
  },
  dropdownStyle: {
    width: 140,
  },
});
