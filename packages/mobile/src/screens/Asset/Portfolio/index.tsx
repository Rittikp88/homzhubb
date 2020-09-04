import React from 'react';
import { StyleSheet, FlatList, View, PickerItemProps } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Text } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
  Loader,
  StateAwareComponent,
} from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
}

interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  selectedFilter: string;
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  attachments: Attachment[];
  isLoading: boolean;
  isSpinnerLoading: boolean;
  expandedAssetId: number;
  isFullScreen: boolean;
  activeSlide: number;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    isBottomSheetVisible: false,
    selectedFilter: Filters.ALL,
    metrics: {} as AssetMetrics,
    filters: [],
    attachments: [],
    isLoading: false,
    isSpinnerLoading: false,
    expandedAssetId: 0,
    isFullScreen: false,
    activeSlide: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getAssetFilters();
    this.getTenancies();
    this.getPortfolioProperty();
    this.updateFilter();
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IPortfolioState>): void {
    const { route } = this.props;
    if (route !== prevProps.route) {
      this.updateFilter();
    }
  }

  public render = (): React.ReactElement => {
    const { isTenanciesLoading } = this.props;
    const { isLoading } = this.state;
    return (
      <StateAwareComponent
        loading={isTenanciesLoading || isLoading}
        renderComponent={this.renderComponent()}
        testID="stateAware"
      />
    );
  };

  private renderComponent = (): React.ReactElement => {
    const { t, tenancies, properties } = this.props;
    const { selectedFilter, isBottomSheetVisible, metrics, filters, isSpinnerLoading } = this.state;
    return (
      <>
        <AnimatedProfileHeader title={t('portfolio')}>
          <>
            <AssetMetricsList
              showPlusIcon
              title={metrics?.assetMetrics?.assets?.count ?? 0}
              data={metrics?.assetMetrics?.assetGroups ?? []}
              subscription={metrics?.userServicePlan?.label}
              onPlusIconClicked={this.handleAddProperty}
              containerStyle={styles.assetCards}
            />
            {tenancies && tenancies.length > 0 && this.renderTenancies(tenancies)}
            {properties && properties.length > 0 && this.renderPortfolio(properties)}
            <BottomSheetListView
              data={filters}
              selectedValue={selectedFilter}
              listTitle={t('propertySearch:filters')}
              listHeight={500}
              isBottomSheetVisible={isBottomSheetVisible}
              onCloseDropDown={this.closeBottomSheet}
              onSelectItem={this.onSelectFilter}
            />
          </>
        </AnimatedProfileHeader>
        {this.renderFullscreenCarousel()}
        <Loader visible={isSpinnerLoading} />
      </>
    );
  };

  private renderTenancies = (tenancies: Asset[]): React.ReactElement => {
    const { t } = this.props;
    const { expandedAssetId } = this.state;
    const renderListItem = ({ item, index }: { item: Asset; index: number }): React.ReactElement =>
      this.renderList(item, index, DataType.TENANCIES);
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        <FlatList data={tenancies} renderItem={renderListItem} extraData={expandedAssetId} />
      </>
    );
  };

  private renderPortfolio = (properties: Asset[]): React.ReactElement => {
    const { t } = this.props;
    const { expandedAssetId } = this.state;
    const renderListItem = ({ item, index }: { item: Asset; index: number }): React.ReactElement =>
      this.renderList(item, index, DataType.PROPERTIES);
    return (
      <>
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
        <FlatList data={properties} renderItem={renderListItem} extraData={expandedAssetId} />
      </>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { expandedAssetId } = this.state;
    const handleViewProperty = (id: number): void => this.onViewProperty(id, type);
    return (
      <AssetCard
        assetData={item}
        key={index}
        expandedId={expandedAssetId}
        onViewProperty={handleViewProperty}
        enterFullScreen={this.onFullScreenToggle}
        onPressArrow={this.handleExpandCollapse}
      />
    );
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen, activeSlide, attachments } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        data={attachments}
        updateSlide={this.updateSlide}
      />
    );
  };

  private onSelectFilter = (value: string): void => {
    this.setState({ selectedFilter: value, expandedAssetId: 0 }, (): void => {
      this.getPortfolioProperty(true);
    });
    this.closeBottomSheet();
  };

  private onFullScreenToggle = (attachments?: Attachment[]): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
    if (attachments) {
      this.setState({ attachments });
    }
  };

  private onViewProperty = (id: number, type: DataType): void => {
    const { navigation, setCurrentAsset } = this.props;
    setCurrentAsset({ id, dataType: type });
    navigation.navigate(ScreensKeys.PropertyDetailScreen);
  };

  private onPropertiesCallback = (): void => {
    this.verifyData();
    this.setState({ isSpinnerLoading: false, isLoading: false });
  };

  private onTenanciesCallback = (): void => {
    this.verifyData();
  };

  private handleExpandCollapse = (id: number): void => {
    const { expandedAssetId } = this.state;
    this.setState({ expandedAssetId: expandedAssetId === id ? 0 : id });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private updateFilter = (): void => {
    const { route } = this.props;
    if (route && route.params && route.params.filter) {
      this.setState({ selectedFilter: route.params.filter, expandedAssetId: 0 }, () => {
        this.getPortfolioProperty();
      });
    }
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
    const { selectedFilter } = this.state;
    const { getPropertyDetails } = this.props;
    if (isFromFilter) {
      this.setState({ isSpinnerLoading: true });
    } else {
      this.setState({ isLoading: true });
    }

    getPropertyDetails({ status: selectedFilter, onCallback: this.onPropertiesCallback });
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private handleAddProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.PostPropertySearch });
  };

  private verifyData = (): void => {
    const { navigation, tenancies, properties } = this.props;
    if ((!tenancies && !properties) || (tenancies && tenancies.length === 0 && properties && properties.length === 0)) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.PropertyPostLandingScreen }],
        })
      );
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    tenancies: PortfolioSelectors.getTenancies(state),
    properties: PortfolioSelectors.getProperties(state),
    isTenanciesLoading: PortfolioSelectors.getTenanciesLoadingState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenanciesDetails, getPropertyDetails, setCurrentAsset } = PortfolioActions;
  return bindActionCreators({ getTenanciesDetails, getPropertyDetails, setCurrentAsset }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
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
});
