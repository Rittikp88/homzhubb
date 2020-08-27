import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  AnimatedProfileHeader,
  FinancialHeaderContainer,
  PropertyDuesCardContainer,
  TransactionCardsContainer,
} from '@homzhub/mobile/src/components';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import { propertyDues } from '@homzhub/common/src/mocks/FinancialsTabMockData';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IState {
  ledgerData: GeneralLedgers[];
}

type Props = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;

export class Financials extends React.PureComponent<Props, IState> {
  public state = {
    ledgerData: [],
  };

  public async componentDidMount(): Promise<void> {
    await this.getGeneralLedgers();
  }

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { ledgerData } = this.state;
    const { currency_symbol, totalDue, details } = propertyDues;

    return (
      <AnimatedProfileHeader title={t('financial')}>
        <>
          {ledgerData && ledgerData.length > 0 && (
            <FinancialHeaderContainer
              onPlusIconClicked={this.onPlusIconPress}
              // @ts-ignore
              title={t('assetFinancial:recordsText')}
              income={LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.credit, ledgerData)}
              expense={LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.debit, ledgerData)}
              individualCardStyle={styles.individualCardStyle}
            />
          )}
          <FinanceOverview />
          <PropertyDuesCardContainer currency={currency_symbol} totalDue={totalDue} propertyDues={details} />
          <TransactionCardsContainer />
        </>
      </AnimatedProfileHeader>
    );
  };

  private onPlusIconPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AddRecordScreen);
  };

  private getGeneralLedgers = async (): Promise<void> => {
    const response: GeneralLedgers[] = await LedgerService.getAllGeneralLedgers(
      DateUtils.getCurrentYearStartDate(),
      DateUtils.getCurrentYearLastDate(),
      DataGroupBy.year
    );

    this.setState({ ledgerData: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials);

const styles = StyleSheet.create({
  individualCardStyle: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
});
