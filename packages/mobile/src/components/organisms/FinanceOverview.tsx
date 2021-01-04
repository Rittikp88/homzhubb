import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
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
    const { t, financialYear } = this.props;
    const { currentTab, selectedTimeRange, data } = this.state;
    const financeUtil = new FinanceUtils(selectedTimeRange, financialYear, data);
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
          <DoubleBarGraph data={financeUtil.getBarGraphData(selectedTimeRange)} />
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
