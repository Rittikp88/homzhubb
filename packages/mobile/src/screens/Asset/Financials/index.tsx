import React from 'react';
import { PickerItemProps } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { AssetMetricsList, IMetricsData } from '@homzhub/mobile/src/components';
import { PropertyByCountryDropdown } from '@homzhub/mobile/src/components/molecules/PropertyByCountryDropdown';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import DuesContainer from '@homzhub/mobile/src/components/organisms/DuesContainer';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/FinancialStack';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IFinancialState, ILedgerMetrics } from '@homzhub/common/src/modules/financials/interfaces';

interface IOwnState {
  isLoading: boolean;
  scrollEnabled: boolean;
}

interface IStateProps {
  assets: Asset[];
  financialLoaders: IFinancialState['loaders'];
  ledgerData: GeneralLedgers[];
  selectedProperty: number;
  selectedCountry: number;
  ledgerMetrics: ILedgerMetrics;
}

interface IDispatchProps {
  getLedgers: () => void;
  setCurrentCountry: (country: number) => void;
  setCurrentProperty: (property: number) => void;
  setTimeRange: (range: number) => void;
  getLedgerMetrics: () => void;
  resetLedgerFilters: () => void;
}

type libraryProps = NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Financials extends React.PureComponent<Props, IOwnState> {
  private onFocusSubscription: any;

  public state = {
    isLoading: false,
    scrollEnabled: true,
  };

  public componentDidMount(): void {
    const { navigation, getLedgerMetrics, resetLedgerFilters } = this.props;

    this.onFocusSubscription = navigation.addListener('focus', (): void => {
      resetLedgerFilters();
      getLedgerMetrics();
    });
  }

  public render = (): React.ReactElement => {
    const {
      t,
      route: { params },
      financialLoaders: { dues, payment },
      selectedCountry,
      selectedProperty,
    } = this.props;
    const { scrollEnabled, isLoading } = this.state;

    const loading = isLoading || dues || payment;

    return (
      <UserScreen
        loading={loading}
        isGradient
        isOuterScrollEnabled={scrollEnabled}
        title={t('financial')}
        onPlusIconClicked={this.onPlusIconPress}
      >
        <AssetMetricsList
          title={t('assetFinancial:summary')}
          numOfElements={2}
          showBackIcon={params?.isFromNavigation ?? false}
          isSubTextRequired={false}
          data={this.getHeaderData()}
        />
        <PropertyByCountryDropdown
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          propertyList={this.getPropertyList()}
          countryList={this.getCountryList()}
          onPropertyChange={this.onPropertyChange}
          onCountryChange={this.onCountryChange}
        />
        <FinanceOverview />
        <DuesContainer />
        <TransactionCardsContainer
          shouldEnableOuterScroll={this.toggleScroll}
          onEditRecord={this.onPressEdit}
          toggleLoading={this.toggleLoading}
        />
      </UserScreen>
    );
  };

  private onPropertyChange = (propertyId: number): void => {
    const { selectedProperty, setCurrentProperty } = this.props;
    if (selectedProperty === propertyId) {
      return;
    }
    setCurrentProperty(propertyId);
  };

  private onCountryChange = (countryId: number): void => {
    const { selectedCountry, setCurrentCountry } = this.props;
    if (selectedCountry === countryId) {
      return;
    }
    setCurrentCountry(countryId);
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

  private onPressEdit = (id: number): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AddRecordScreen, { isEditFlow: true, transactionId: id });
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };

  private toggleLoading = (loading: boolean): void => {
    this.setState({ isLoading: loading });
  };

  private getHeaderData = (): IMetricsData[] => {
    const {
      t,
      ledgerMetrics: { income, expense },
    } = this.props;
    const currentYear = DateUtils.getCurrentYear();

    return [
      {
        name: t('assetFinancial:income', { year: currentYear }),
        count: income,
        isCurrency: true,
        colorCode: theme.colors.incomeGreen,
      },
      {
        name: t('assetFinancial:expense', { year: currentYear }),
        count: expense,
        isCurrency: true,
        colorCode: theme.colors.yellowTint2,
      },
    ];
  };

  private getCountryList = (): Country[] => {
    const { assets } = this.props;
    return uniqBy(
      assets.map((asset) => asset.country),
      'id'
    );
  };

  private getPropertyList = (): PickerItemProps[] => {
    const { assets, selectedCountry } = this.props;

    return (selectedCountry === 0 ? assets : assets.filter((asset) => selectedCountry === asset.country.id)).map(
      (asset) => ({
        label: asset.projectName,
        value: asset.id,
      })
    );
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssets } = UserSelector;
  const {
    getFinancialLoaders,
    getLedgerData,
    getSelectedCountry,
    getSelectedProperty,
    getLedgerMetrics,
  } = FinancialSelectors;
  return {
    assets: getUserAssets(state),
    financialLoaders: getFinancialLoaders(state),
    ledgerData: getLedgerData(state),
    selectedProperty: getSelectedProperty(state),
    selectedCountry: getSelectedCountry(state),
    ledgerMetrics: getLedgerMetrics(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    getLedgers,
    setCurrentCountry,
    setCurrentProperty,
    setTimeRange,
    getLedgerMetrics,
    resetLedgerFilters,
  } = FinancialActions;
  return bindActionCreators(
    {
      getLedgers,
      setCurrentCountry,
      setCurrentProperty,
      setTimeRange,
      getLedgerMetrics,
      resetLedgerFilters,
    },
    dispatch
  );
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials));
export default connectedComponent;
