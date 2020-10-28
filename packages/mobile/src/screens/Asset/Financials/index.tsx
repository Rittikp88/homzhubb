import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader, AssetMetricsList, Loader, IMetricsData } from '@homzhub/mobile/src/components';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

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

    this.onFocusSubscription = navigation.addListener(
      'focus',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (): Promise<void> => {
        this.setState({ isLoading: true });
        await this.getGeneralLedgersPref();
        await this.getGeneralLedgers();
        this.setState({ isLoading: false });
      }
    );
  }

  public render = (): React.ReactElement => {
    const { isLoading } = this.state;
    return (
      <>
        {this.renderComponent()}
        <Loader visible={isLoading} />
      </>
    );
  };

  private renderComponent = (): React.ReactElement => {
    const { t } = this.props;
    const { transactionsData, scrollEnabled } = this.state;

    return (
      <AnimatedProfileHeader isOuterScrollEnabled={scrollEnabled} title={t('financial')}>
        <>
          <AssetMetricsList
            title={t('assetFinancial:recordsText')}
            numOfElements={2}
            data={this.getHeaderData()}
            onPlusIconClicked={this.onPlusIconPress}
            textStyle={styles.priceStyle}
          />
          <FinanceOverview />
          {transactionsData.length > 0 && (
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

  private getHeaderData = (): IMetricsData[] => {
    const { t } = this.props;
    const { ledgerData } = this.state;
    const currentYear = DateUtils.getCurrentYear();

    return [
      {
        label: t('assetFinancial:income', { year: currentYear }),
        count: `${LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.credit, ledgerData)}/-`,
        currencySymbol: 'INR',
        // @ts-ignore
        colorGradient: { hexColorA: theme.colors.gradientA, hexColorB: theme.colors.gradientB, location: [0, 1] },
      },
      {
        label: t('assetFinancial:expense', { year: currentYear }),
        count: `${LedgerUtils.getSumOfTransactionsOfType(LedgerTypes.debit, ledgerData)}/-`,
        currencySymbol: 'INR',
        // @ts-ignore
        colorGradient: { hexColorA: theme.colors.gradientC, hexColorB: theme.colors.gradientD, location: [0, 1] },
      },
    ];
  };

  private getGeneralLedgersPref = async (): Promise<void> => {
    try {
      const response: GeneralLedgers[] = await LedgerService.getLedgerPerformances(
        DateUtils.getCurrentYearStartDate(),
        DateUtils.getCurrentYearLastDate(),
        DataGroupBy.year
      );

      this.setState({ ledgerData: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getGeneralLedgers = async (): Promise<void> => {
    const { transactionsData } = this.state;

    try {
      const response: FinancialTransactions = await LedgerService.getGeneralLedgers(transactionsData.length);

      this.setState({
        transactionsData: [...transactionsData, ...response.results],
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials);

const styles = StyleSheet.create({
  priceStyle: {
    textAlign: 'center',
    color: theme.colors.white,
  },
});
