import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
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
  StateAwareComponent,
} from '@homzhub/mobile/src/components';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { propertyDues } from '@homzhub/common/src/mocks/FinancialsTabMockData';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';

interface IState {
  ledgerData: GeneralLedgers[];
  transactionsData: FinancialRecords[];
  isLoading: boolean;
  scrollEnabled: boolean;
}

type Props = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;

export class Financials extends React.PureComponent<Props, IState> {
  private onFocusSubscription: any;

  public state = {
    ledgerData: [],
    transactionsData: [],
    isLoading: false,
    scrollEnabled: true,
  };

  public componentDidMount(): void {
    const { navigation } = this.props;

    this.onFocusSubscription = navigation.addListener('focus', (): void => {
      this.getGeneralLedgersPref().then();
      this.getGeneralLedgers().then();
    });
  }

  public render = (): React.ReactElement => {
    const { isLoading } = this.state;
    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  };

  private renderComponent = (): React.ReactElement => {
    const { t } = this.props;
    const { ledgerData, transactionsData, scrollEnabled } = this.state;
    const { currency_symbol, totalDue, details } = propertyDues;

    return (
      <AnimatedProfileHeader isOuterScrollEnabled={scrollEnabled} title={t('financial')}>
        <>
          <FinancialHeaderContainer
            onPlusIconClicked={this.onPlusIconPress}
            // @ts-ignore
            title={t('assetFinancial:recordsText')}
            income={LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.credit, ledgerData)}
            expense={LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.debit, ledgerData)}
            individualCardStyle={styles.individualCardStyle}
          />
          <FinanceOverview />
          <PropertyDuesCardContainer currency={currency_symbol} totalDue={totalDue} propertyDues={details} />
          {transactionsData && transactionsData.length > 0 && (
            <TransactionCardsContainer
              shouldEnableOuterScroll={this.toggleScroll}
              transactionsData={transactionsData}
              onEndReachedHandler={this.onEndReachedHandler}
            />
          )}
        </>
      </AnimatedProfileHeader>
    );
  };

  private onEndReachedHandler = async (): Promise<void> => {
    await this.getGeneralLedgers();
  };

  private onPlusIconPress = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AddRecordScreen);
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };

  private getGeneralLedgersPref = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: GeneralLedgers[] = await LedgerService.getLedgerPerformances(
        DateUtils.getCurrentYearStartDate(),
        DateUtils.getCurrentYearLastDate(),
        DataGroupBy.year
      );

      this.setState({ ledgerData: response, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getGeneralLedgers = async (): Promise<void> => {
    const { transactionsData } = this.state;
    this.setState(() => {
      return { isLoading: false };
    });

    try {
      const response: FinancialTransactions = await LedgerService.getGeneralLedgers(transactionsData.length);

      this.setState({
        transactionsData: [...transactionsData, ...response.results],
        isLoading: false,
      });
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials);

const styles = StyleSheet.create({
  individualCardStyle: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
});
