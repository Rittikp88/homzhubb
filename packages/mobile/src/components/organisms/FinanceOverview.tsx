import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { mapValues, groupBy, sumBy } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Label, SelectionPicker, Text } from '@homzhub/common/src/components';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';
import { GeneralLedgers, DataGroupBy, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';

enum TabKeys {
  expenses = 1,
  cashFlow = 2,
}

enum DateFilter {
  thisMonth = 1,
  lastMonth = 2,
  thisYear = 3,
  thisFinancialYear = 4,
  lastYear = 5,
}

// TODO: Figure out how to get these label values from translations
const DROPDOWN_DATA = {
  [DateFilter.thisMonth]: {
    label: 'This month',
    value: DateFilter.thisMonth,
    startDate: DateUtils.getCurrentMonthStartDate(),
    endDate: DateUtils.getCurrentMonthLastDate(),
    dataGroupBy: DataGroupBy.month,
  },
  [DateFilter.lastMonth]: {
    label: 'Last month',
    value: DateFilter.lastMonth,
    startDate: DateUtils.getPreviousMonthStartDate(),
    endDate: DateUtils.getPreviousMonthLastDate(),
    dataGroupBy: DataGroupBy.month,
  },
  [DateFilter.thisYear]: {
    label: 'This year',
    value: DateFilter.thisYear,
    startDate: DateUtils.getCurrentYearStartDate(),
    endDate: DateUtils.getCurrentDate(),
    dataGroupBy: DataGroupBy.year,
  },
  [DateFilter.thisFinancialYear]: {
    label: 'This financial year',
    value: DateFilter.thisFinancialYear,
    startDate: `${DateUtils.getCurrentYear()}-04-01`,
    endDate: `${DateUtils.getNextYear()}-03-31`,
    dataGroupBy: DataGroupBy.year,
  },
  [DateFilter.lastYear]: {
    label: 'Last year',
    value: DateFilter.lastYear,
    startDate: DateUtils.getPreviousYearStartDate(),
    endDate: DateUtils.getPreviousYearLastDate(),
    dataGroupBy: DataGroupBy.year,
  },
};

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface IState {
  currentTab: TabKeys;
  selectedTimeRange: DateFilter;
  data: GeneralLedgers[];
}

export class FinanceOverview extends React.PureComponent<WithTranslation, IState> {
  public state = {
    currentTab: TabKeys.expenses,
    selectedTimeRange: DateFilter.thisMonth,
    data: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getGeneralLedgers();
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { currentTab, selectedTimeRange, data } = this.state;
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('overallPerformance')}
        </Text>
        <SelectionPicker
          data={[
            { title: t('expenses'), value: TabKeys.expenses },
            { title: t('cashFlow'), value: TabKeys.cashFlow },
          ]}
          optionWidth={(theme.viewport.width - 55) / 2}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
          testID="financeSelection"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateSection}>
            <Icon name={icons.calendar} size={22} />
            <Label style={styles.dateText} type="large" textType="semiBold">
              {this.getCalendarLabels()}
            </Label>
          </View>
          <Dropdown
            data={Object.values(DROPDOWN_DATA)}
            value={selectedTimeRange}
            // @ts-ignore
            onDonePress={this.onTimeRangeChange}
            iconColor={theme.colors.active}
            listHeight={theme.viewport.height / 2}
            testID="drpTimeRange"
            containerStyle={styles.dropdownStyle}
          />
        </View>
        {currentTab === TabKeys.expenses ? (
          <DonutGraph data={LedgerUtils.getLedgerDataOfType(LedgerTypes.debit, data)} />
        ) : (
          <DoubleBarGraph data={this.getBarGraphData()} />
        )}
      </View>
    );
  };

  // TODO: Check the return type here
  // eslint-disable-next-line @typescript-eslint/require-await
  private onTabChange = async (tabId: TabKeys): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ currentTab: tabId }, async () => {
      await this.getGeneralLedgers();
    });
  };

  // TODO: Check the return type here
  // eslint-disable-next-line @typescript-eslint/require-await
  private onTimeRangeChange = async (selectedTimeRange: number): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ selectedTimeRange }, async () => {
      await this.getGeneralLedgers();
    });
  };

  public getGeneralLedgers = async (): Promise<void> => {
    const { selectedTimeRange, currentTab } = this.state;
    const { endDate, startDate, dataGroupBy } = DROPDOWN_DATA[selectedTimeRange];
    const getTransactionGroupBy = (): DataGroupBy => {
      if (currentTab === TabKeys.cashFlow) {
        // For bar graph, we need all data by months
        return DataGroupBy.month;
      }
      return dataGroupBy;
    };
    /* Empty the data before adding new */
    this.setState({ data: [] });
    const response: GeneralLedgers[] = await LedgerService.getLedgerPerformances(
      startDate,
      endDate,
      getTransactionGroupBy()
    );
    this.setState({ data: response });
  };

  public getBarGraphData = (): { data1: number[]; data2: number[]; label: string[] } => {
    const { selectedTimeRange, data } = this.state;

    const sumForMonth = (type: LedgerTypes): number[] => {
      return LedgerUtils.getAllTransactionsOfType(type, data);
    };

    const groupByTransactionDate = mapValues(groupBy(data, 'transactionDateLabel'));

    const sumOfGivenTypeWithData = (type: string, currentData: GeneralLedgers[]): number => {
      const filteredData = currentData.filter((ledger: GeneralLedgers) => ledger.entryType === type);
      return sumBy(filteredData, (ledger: GeneralLedgers) => ledger.amount);
    };

    const dataByMonths = (): { data1: number[]; data2: number[]; label: string[] } => {
      const data1: number[] = new Array(12).fill(0);
      const data2: number[] = new Array(12).fill(0);
      Object.keys(groupByTransactionDate).forEach((key: string) => {
        const currentMonthData = groupByTransactionDate[key];
        const debitsSum = sumOfGivenTypeWithData(LedgerTypes.debit, currentMonthData);
        const creditsSum = sumOfGivenTypeWithData(LedgerTypes.credit, currentMonthData);
        const currentMonthIndex = DateUtils.getMonthIndex(key);
        data1[currentMonthIndex] = debitsSum;
        data2[currentMonthIndex] = creditsSum;
      });
      return {
        data1,
        data2,
        label: monthLabels,
      };
    };

    switch (selectedTimeRange) {
      case DateFilter.thisYear:
      case DateFilter.thisFinancialYear:
      case DateFilter.lastYear:
        return dataByMonths();
      default:
        return {
          data1: sumForMonth(LedgerTypes.debit),
          data2: sumForMonth(LedgerTypes.credit),
          label: DateFilter.lastMonth
            ? [monthLabels[DateUtils.getCurrentMonthIndex() - 1]]
            : [monthLabels[DateUtils.getCurrentMonthIndex()]],
        };
    }
  };

  public getCalendarLabels = (): string => {
    const { selectedTimeRange } = this.state;
    switch (selectedTimeRange) {
      case DateFilter.thisYear:
        return DateUtils.getCurrentYear();
      case DateFilter.lastMonth:
        return DateUtils.getLastMonth();
      case DateFilter.lastYear:
        return DateUtils.getLastYear();
      case DateFilter.thisFinancialYear:
        return DateUtils.getCurrentFinancialYear();
      default:
        return DateUtils.getCurrentMonth();
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(FinanceOverview);

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
    flexDirection: 'row',
  },
  title: {
    marginBottom: 16,
  },
  dateText: {
    marginStart: 8,
    color: theme.colors.darkTint4,
  },
  dropdownStyle: {
    width: 140,
  },
});
