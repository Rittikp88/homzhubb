import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { BottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { cashFlowData, propertyDues } from '@homzhub/common/src/mocks/FinancialsTabMockData';
import { AnimatedProfileHeader, AssetMetricsList } from '@homzhub/mobile/src/components';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import { PropertyDuesCardContainer } from '@homzhub/mobile/src/components/organisms/PropertyDuesCardContainer';
import { Miscellaneous } from '@homzhub/common/src/domain/models/AssetMetrics';

type libraryProps = WithTranslation & NavigationScreenProps<BottomTabNavigatorParamList, ScreensKeys.Financials>;
type Props = libraryProps;

export class Financials extends React.PureComponent<Props, {}> {
  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { currency_symbol, totalDue, details } = propertyDues;
    const deserializedCashFlowData: Miscellaneous[] = ObjectMapper.deserializeArray(Miscellaneous, cashFlowData);

    return (
      <AnimatedProfileHeader title={t('financial')}>
        <>
          <AssetMetricsList
            showPlusIcon
            // @ts-ignore
            title={t('assetDashboard:cashFlow')}
            data={deserializedCashFlowData}
            containerStyle={styles.cashFlowContainer}
            individualCardStyle={styles.individualCardStyle}
          />
          <FinanceOverview />
          <PropertyDuesCardContainer currency={currency_symbol} totalDue={totalDue} propertyDues={details} />
        </>
      </AnimatedProfileHeader>
    );
  };
}

const namespace = LocaleConstants.namespacesKey;
export default withTranslation([namespace.assetFinancial, namespace.assetDashboard])(Financials);

const styles = StyleSheet.create({
  cashFlowContainer: {
    marginVertical: 12,
  },
  individualCardStyle: {
    paddingHorizontal: 29,
  },
});
