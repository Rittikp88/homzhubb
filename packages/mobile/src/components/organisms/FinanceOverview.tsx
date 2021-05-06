import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
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
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

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

  public componentDidMount = (): void => {
    this.getLedgersData().then();
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { selectedCountry: oldCountry, selectedProperty: oldProperty } = prevProps;
    const { selectedProperty, selectedCountry } = this.props;
    if (selectedProperty !== oldProperty || selectedCountry !== oldCountry) {
      this.getLedgersData().then();
    }
  };

  public render = (): React.ReactNode => {
    const { t, financialYear } = this.props;
    const { currentTab, selectedTimeRange, data } = this.state;
    return (
      <View style={styles.container}>
        <OnFocusCallback isAsync callback={this.getLedgersData} />
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('overallPerformance')}
        </Text>
        <SelectionPicker
          data={[
            { title: t('expenses'), value: TabKeys.expenses },
            { title: t('incomeText'), value: TabKeys.cashFlow },
          ]}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
          testID="financeSelection"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateSection}>
            <Icon name={icons.calendar} size={22} color={theme.colors.darkTint4} />
            <Label numberOfLines={1} style={styles.dateText} type="large" textType="semiBold">
              {FinanceUtils.renderCalenderLabel({ selectedTimeRange, financialYear })}
            </Label>
          </View>
          <Dropdown
            data={FinanceUtils.renderFilterOptions(t)}
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
          <DoubleBarGraph data={FinanceUtils.getBarGraphData({ selectedTimeRange, financialYear }, data)} />
        )}
      </View>
    );
  };

  private onTabChange = (tabId: TabKeys): void => {
    this.setState({ currentTab: tabId }, () => {
      this.getLedgersData().then();
    });
  };

  private onTimeRangeChange = (selectedTimeRange: number): void => {
    this.setState({ selectedTimeRange }, () => {
      this.getLedgersData().then();
    });
  };

  private getLedgersData = async (): Promise<void> => {
    const { selectedCountry, selectedProperty, financialYear } = this.props;
    const { selectedTimeRange } = this.state;

    await FinanceUtils.getGeneralLedgers(
      {
        selectedTimeRange,
        financialYear,
        selectedCountry,
        selectedProperty,
      },
      (response: GeneralLedgers[]) => {
        this.setState({ data: response });
      },
      (errorMsg: string) => {
        AlertHelper.error({ message: errorMsg });
      }
    ).then();
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
