import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { groupBy, mapValues, sumBy } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Label, OnFocusCallback, SelectionPicker, Text } from '@homzhub/common/src/components';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  DateFilter,
  FINANCIAL_DROPDOWN_DATA,
  IDropdownObject,
  MONTH_LABELS,
} from '@homzhub/common/src/constants/FinanceOverview';

enum TabKeys {
  expenses = 1,
  cashFlow = 2,
}

interface IOwnState {
  currentTab: TabKeys;
  selectedTimeRange: DateFilter;
  data: GeneralLedgers[];
}

interface IStateProps {
  financialYear: { startDate: string; endDate: string };
}
type Props = IStateProps & WithTranslation;

export class FinanceOverview extends React.PureComponent<Props, IOwnState> {
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
        <OnFocusCallback callback={this.getGeneralLedgers} />
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
            data={this.getFinancialDropdownData()}
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

  private onTabChange = (tabId: TabKeys): void => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ currentTab: tabId }, async () => {
      await this.getGeneralLedgers();
    });
  };

  private onTimeRangeChange = (selectedTimeRange: number): void => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ selectedTimeRange }, async () => {
      await this.getGeneralLedgers();
    });
  };

  public getGeneralLedgers = async (): Promise<void> => {
    const {
      financialYear: { endDate: finEndDate, startDate: finStartDate },
    } = this.props;
    const { selectedTimeRange, currentTab } = this.state;

    // @ts-ignore
    let { endDate, startDate } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];
    // @ts-ignore
    const { value, dataGroupBy } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];

    if (value === DateFilter.thisFinancialYear) {
      endDate = finEndDate;
      startDate = finStartDate;
    }

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
        label: MONTH_LABELS,
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
            ? [MONTH_LABELS[DateUtils.getCurrentMonthIndex() - 1]]
            : [MONTH_LABELS[DateUtils.getCurrentMonthIndex()]],
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

  public getFinancialDropdownData = (): IDropdownObject[] => {
    const { t } = this.props;
    const data = Object.values(FINANCIAL_DROPDOWN_DATA);

    return data.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
      };
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserFinancialYear } = UserSelector;
  return {
    financialYear: getUserFinancialYear(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(FinanceOverview));

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
