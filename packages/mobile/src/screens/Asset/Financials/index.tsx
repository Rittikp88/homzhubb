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

// Todo (Sriram 2020.09.08) Do we need this?
enum LoadTypes {
  ScreenLoad = 'ScreenLoad',
  ComponentLoad = 'ComponentLoad',
}

interface IState {
  ledgerData: GeneralLedgers[];
  transactionsData: FinancialRecords[];
  isLoading: boolean;
  isComponentLoading: boolean;
  scrollEnabled: boolean;
}

type Props = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;

export class Financials extends React.PureComponent<Props, IState> {
  public state = {
    ledgerData: [],
    transactionsData: [],
    isLoading: false,
    isComponentLoading: false,
    scrollEnabled: true,
  };

  public async componentDidMount(): Promise<void> {
    await this.getGeneralLedgersPref();
    await this.getGeneralLedgers(LoadTypes.ScreenLoad);
  }

  public render = (): React.ReactElement => {
    const { isLoading } = this.state;
    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  };

  private renderComponent = (): React.ReactElement => {
    const { t } = this.props;
    const { ledgerData, transactionsData, scrollEnabled, isComponentLoading } = this.state;
    const { currency_symbol, totalDue, details } = propertyDues;

    return (
      <AnimatedProfileHeader isOuterScrollEnabled={scrollEnabled} title={t('financial')}>
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
          <TransactionCardsContainer
            shouldEnableOuterScroll={this.toggleScroll}
            transactionsData={transactionsData}
            isLoading={isComponentLoading}
            onEndReachedHandler={this.onEndReachedHandler}
          />
        </>
      </AnimatedProfileHeader>
    );
  };

  private onEndReachedHandler = async (): Promise<void> => {
    await this.getGeneralLedgers(LoadTypes.ComponentLoad);
  };

  private onPlusIconPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AddRecordScreen);
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

  private getGeneralLedgers = async (type: LoadTypes): Promise<void> => {
    const { transactionsData } = this.state;
    this.setState(() => {
      if (type === LoadTypes.ScreenLoad) {
        return { isLoading: true, isComponentLoading: false };
      }
      return { isComponentLoading: true, isLoading: false };
    });

    try {
      const response: FinancialTransactions = await LedgerService.getGeneralLedgers(transactionsData.length);

      this.setState({ transactionsData: [...transactionsData, ...response.results], isLoading: false });
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
