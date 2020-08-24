import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Label, SelectionPicker, Text } from '@homzhub/common/src/components';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';

enum TabKeys {
  costBreakdown = 1,
  cashFlow = 2,
}

interface IState {
  currentTab: TabKeys;
  selectedTimeRange: string;
}

// TODO: Need to figure this out as a typesafe solution, try and remove the use of this constant
const DROPDOWN_DATA = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Annually', value: 'Annually' },
];

export class FinanceOverview extends React.PureComponent<WithTranslation, IState> {
  public state = {
    currentTab: TabKeys.costBreakdown,
    selectedTimeRange: 'Monthly',
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { currentTab, selectedTimeRange } = this.state;
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('overallPerformance')}
        </Text>
        <SelectionPicker
          data={[
            { title: t('costBreakdown'), value: TabKeys.costBreakdown },
            { title: t('cashFlow'), value: TabKeys.cashFlow },
          ]}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
          testID="financeSelection"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateSection}>
            <Icon name={icons.calendar} size={22} />
            <Label style={styles.dateText} type="large" textType="semiBold">
              June, 2020
            </Label>
          </View>
          <Dropdown
            data={DROPDOWN_DATA}
            value={selectedTimeRange}
            onDonePress={this.onTimeRangeChange}
            iconColor={theme.colors.active}
            listHeight={theme.viewport.height * 0.3}
            testID="drpTimeRange"
          />
        </View>
        {selectedTimeRange === 'Monthly' ? <DonutGraph /> : <DoubleBarGraph />}
      </View>
    );
  };

  private onTabChange = (tabId: TabKeys): void => {
    this.setState({ currentTab: tabId });
  };

  private onTimeRangeChange = (selectedTimeRange: string | number): void => {
    this.setState({ selectedTimeRange: selectedTimeRange as string });
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
});
