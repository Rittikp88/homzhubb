import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import AssetCard from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';
import PortfolioFilter from '@homzhub/web/src/screens/portfolio/components/PortfolioFilter';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
  currentFilter: Filters;
}

interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setCurrentFilter: (payload: Filters) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
  clearMessages: () => void;
}

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  isLoading: boolean;
  isSpinnerLoading: boolean;
  expandedTenanciesId: number;
  expandedAssetId: number;
  assetType: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {

  public state = {
    isBottomSheetVisible: false,
    metrics: {} as AssetMetrics,
    filters: [],
    isLoading: false,
    isSpinnerLoading: false,
    expandedTenanciesId: 0,
    expandedAssetId: 0,
    assetType: '',
  };

  public componentDidMount = (): void => {
    this.getScreenData();
    PortfolioRepository.getAssetFilters()
    .then((response) => {
      this.setState({
        filters: response
      })
    })
    .catch((e) => {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    });
  };



  public render = (): React.ReactElement => {
    const {  properties } = this.props;
    const {filters} = this.state
    return ( 
        <View style={{flexDirection:'column'}}>
      <PortfolioFilter filterData={filters} getStatus={this.getStatus} />
        {this.renderPortfolio(properties)}
        </View>
    );
  };


  private renderPortfolio = (properties: Asset[] | null): React.ReactElement => {
    const { t, currentFilter } = this.props;
    const { assetType } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');

    const data = assetType ? (properties ?? []).filter((item) => item.assetGroup.name === assetType) : properties;

    const isEmpty = !data || data.length <= 0;

    return (
      <View style={{flexDirection:'column', maxWidth:'100%'}}>
        <View style={styles.headingView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
          <Icon
            name={icons.verticalDots}
            color={theme.colors.darkTint4}
            size={18}
            onPress={this.handleBottomSheet}
            testID="menu"
          />
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          data?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </View> 
    );
  };


  private getStatus = (status: string): void => {
    PortfolioRepository.getUserAssetDetails(status)
      .then((response) => {
        // TODO :Use the response to display filteredcard :Mohak
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error });
      });
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
 
    return (
      <AssetCard
        assetData={item}
        key={index}
        expandedId={type === DataType.PROPERTIES ? expandedAssetId : expandedTenanciesId}
        isFromTenancies={type === DataType.TENANCIES}
        onViewProperty={FunctionUtils.noop}
        onPressArrow={FunctionUtils.noop}
        onCompleteDetails={FunctionUtils.noop}
        onOfferVisitPress={FunctionUtils.noop}
        onHandleAction={FunctionUtils.noop}
      />
    );
  };


  private onPropertiesCallback = (): void => {
    this.verifyData();
    this.setState({ isSpinnerLoading: false, isLoading: false });
  };

  private onTenanciesCallback = (): void => {
    this.verifyData();
  };


  private getScreenData = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getAssetFilters();
    this.getTenancies();
    this.getPortfolioProperty();
  };


  private getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
      this.setState({ metrics: response, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getAssetFilters = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: AssetFilter[] = await PortfolioRepository.getAssetFilters();
      const filterData: PickerItemProps[] = response.map(
        (item): PickerItemProps => {
          return {
            label: item.title,
            value: item.label,
          };
        }
      );
      this.setState({ filters: filterData, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getTenancies = (): void => {
    const { getTenanciesDetails } = this.props;
    getTenanciesDetails({ onCallback: this.onTenanciesCallback });
  };

  private getPortfolioProperty = (isFromFilter?: boolean): void => {
    const { getPropertyDetails, currentFilter } = this.props;
    if (isFromFilter) {
      this.setState({ isSpinnerLoading: true });
    } else {
      this.setState({ isLoading: true });
    }
    getPropertyDetails({ status: currentFilter, onCallback: this.onPropertiesCallback });
  };

  private handleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };




  private verifyData = (): void => {
    const { tenancies, properties } = this.props;

    if ((tenancies && tenancies.length > 0) || (properties && properties.length > 0)) {
      if (tenancies && tenancies.length > 0) {
        this.setState({
          expandedTenanciesId: tenancies[0].id,
        });
      }

      if (properties && properties.length > 0) {
        this.setState({
          expandedAssetId: properties[0].id,
        });
      }
    }
    
    
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    tenancies: PortfolioSelectors.getTenancies(state),
    properties: PortfolioSelectors.getProperties(state),
    currentFilter: PortfolioSelectors.getCurrentFilter(state),
    isTenanciesLoading: PortfolioSelectors.getTenanciesLoadingState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenanciesDetails, getPropertyDetails, setCurrentAsset, setCurrentFilter } = PortfolioActions;
  const { setAssetId, setEditPropertyFlow } = RecordAssetActions;
  const { clearMessages } = CommonActions;
  return bindActionCreators(
    {
      getTenanciesDetails,
      getPropertyDetails,
      setCurrentAsset,
      setCurrentFilter,
      setAssetId,
      setEditPropertyFlow,
      clearMessages,
    },
    dispatch)
  }




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyView: {
    minHeight: 200,
  },
});
