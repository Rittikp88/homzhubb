import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AnimatedProfileHeader, AssetMetricsList, Loader, IMetricsData } from '@homzhub/mobile/src/components';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IOwnState {
  ledgerData: GeneralLedgers[];
  transactionsData: FinancialRecords[];
  isLoading: boolean;
  scrollEnabled: boolean;
}

interface IStateProps {
  assets: Asset[];
}
interface IDispatchProps {
  getAssets: () => void;
}
type libraryProps = NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Financials extends React.PureComponent<Props, IOwnState> {
  private onFocusSubscription: any;

  public state = {
    ledgerData: [],
    transactionsData: [],
    isLoading: false,
    scrollEnabled: true,
  };

  public componentDidMount(): void {
    const { navigation, getAssets } = this.props;

    this.onFocusSubscription = navigation.addListener(
      'focus',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (): Promise<void> => {
        this.setState({ isLoading: true });
        getAssets();
        await this.getGeneralLedgersPref();
        await this.getGeneralLedgers(true);
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
            isSubTextRequired={false}
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
      assets,
      t,
      navigation: { navigate },
    } = this.props;

    if (assets.length <= 0) {
      AlertHelper.error({ message: t('addProperty') });
      return;
    }

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
        count: `${LedgerUtils.totalByType(LedgerTypes.credit, ledgerData)}`,
        isCurrency: true,
        // @ts-ignore
        colorGradient: { hexColorA: theme.colors.gradientA, hexColorB: theme.colors.gradientB, location: [0, 1] },
      },
      {
        label: t('assetFinancial:expense', { year: currentYear }),
        count: `${LedgerUtils.totalByType(LedgerTypes.debit, ledgerData)}`,
        isCurrency: true,
        // @ts-ignore
        colorGradient: { hexColorA: theme.colors.gradientC, hexColorB: theme.colors.gradientD, location: [0, 1] },
      },
    ];
  };

  private getGeneralLedgersPref = async (): Promise<void> => {
    try {
      const response: GeneralLedgers[] = await LedgerRepository.getLedgerPerformances({
        transaction_date__gte: DateUtils.getCurrentYearStartDate(),
        transaction_date__lte: DateUtils.getCurrentYearLastDate(),
        transaction_date_group_by: DataGroupBy.year,
      });

      this.setState({ ledgerData: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getGeneralLedgers = async (reset = false): Promise<void> => {
    const { transactionsData } = this.state;

    try {
      const response: FinancialTransactions = await LedgerRepository.getGeneralLedgers(
        reset ? 0 : transactionsData.length
      );

      if (response.results.length === 0) {
        return;
      }

      this.setState({
        transactionsData: reset ? [...response.results] : [...transactionsData, ...response.results],
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssets } = UserSelector;
  return {
    assets: getUserAssets(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssets } = UserActions;
  return bindActionCreators({ getAssets }, dispatch);
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials));
export default connectedComponent;

const styles = StyleSheet.create({
  priceStyle: {
    textAlign: 'center',
    color: theme.colors.white,
  },
});
