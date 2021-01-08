import React from 'react';
import { PickerItemProps } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AssetMetricsList, IMetricsData } from '@homzhub/mobile/src/components';
import { PropertyByCountryDropdown } from '@homzhub/mobile/src/components/molecules/PropertyByCountryDropdown';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IOwnState {
  ledgerData: GeneralLedgers[];
  selectedProperty: number;
  selectedCountry: number;
  isLoading: boolean;
  scrollEnabled: boolean;
}

interface IStateProps {
  assets: Asset[];
}
type libraryProps = NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps;

export class Financials extends React.PureComponent<Props, IOwnState> {
  private onFocusSubscription: any;

  public state = {
    ledgerData: [],
    isLoading: false,
    scrollEnabled: true,
    selectedProperty: 0,
    selectedCountry: 0,
  };

  public componentDidMount(): void {
    const { navigation } = this.props;

    this.onFocusSubscription = navigation.addListener('focus', (): void => {
      this.setState({ selectedProperty: 0, selectedCountry: 0 }, () => {
        this.getGeneralLedgersPref().then();
      });
    });
  }

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { scrollEnabled, selectedProperty, selectedCountry, isLoading } = this.state;

    return (
      <UserScreen loading={isLoading} isGradient isOuterScrollEnabled={scrollEnabled} title={t('financial')}>
        <AssetMetricsList
          title={t('assetFinancial:recordsText')}
          numOfElements={2}
          isSubTextRequired={false}
          data={this.getHeaderData()}
          onPlusIconClicked={this.onPlusIconPress}
        />
        <PropertyByCountryDropdown
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          propertyList={this.getPropertyList()}
          countryList={this.getCountryList()}
          onPropertyChange={this.onPropertyChange}
          onCountryChange={this.onCountryChange}
        />
        <FinanceOverview selectedProperty={selectedProperty} selectedCountry={selectedCountry} />
        <TransactionCardsContainer
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          shouldEnableOuterScroll={this.toggleScroll}
        />
      </UserScreen>
    );
  };

  private onPropertyChange = (propertyId: number): void => {
    const { selectedProperty } = this.state;
    if (selectedProperty === propertyId) {
      return;
    }
    this.setState({ selectedProperty: propertyId });
  };

  private onCountryChange = (countryId: number): void => {
    const { selectedCountry } = this.state;
    if (selectedCountry === countryId) {
      return;
    }
    this.setState({ selectedCountry: countryId });
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

    // @ts-ignore
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
        name: t('assetFinancial:income', { year: currentYear }),
        count: `${LedgerUtils.totalByType(LedgerTypes.credit, ledgerData)}`,
        isCurrency: true,
        colorCode: theme.colors.incomeGreen,
      },
      {
        name: t('assetFinancial:expense', { year: currentYear }),
        count: `${LedgerUtils.totalByType(LedgerTypes.debit, ledgerData)}`,
        isCurrency: true,
        colorCode: theme.colors.expenseOrange,
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

  private getCountryList = (): Country[] => {
    const { assets } = this.props;
    return uniqBy(
      assets.map((asset) => asset.country),
      'id'
    );
  };

  private getPropertyList = (): PickerItemProps[] => {
    const { assets } = this.props;
    const { selectedCountry } = this.state;

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
  return {
    assets: getUserAssets(state),
  };
};

const connectedComponent = connect(mapStateToProps)(
  withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials)
);
export default connectedComponent;
