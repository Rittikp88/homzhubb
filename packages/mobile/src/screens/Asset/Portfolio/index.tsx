import React from 'react';
import { StyleSheet, FlatList, View, PickerItemProps } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
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
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  selectedFilter: string;
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  tenancies: Asset[];
  portfolioProperties: Asset[];
  attachments: Attachment[];
  isLoading: boolean;
  isSpinnerLoading: boolean;
  expandedAssetId: number;
  isFullScreen: boolean;
  activeSlide: number;
}

type Props = WithTranslation & NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    isBottomSheetVisible: false,
    selectedFilter: Filters.ALL,
    metrics: {} as AssetMetrics,
    filters: [],
    tenancies: [],
    portfolioProperties: [],
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
    await this.getTenancies();
    await this.getPortfolioProperty();
    this.verifyData();
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IPortfolioState>): void {
    const { route } = this.props;
    if (route !== prevProps.route) {
      this.updateFilter();
    }
  }

  public render = (): React.ReactElement => {
    const { isLoading } = this.state;
    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  };

  private renderComponent = (): React.ReactElement => {
    const { t } = this.props;
    const {
      selectedFilter,
      isBottomSheetVisible,
      metrics,
      filters,
      isSpinnerLoading,
      tenancies,
      portfolioProperties,
    } = this.state;
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
            {tenancies.length > 0 && this.renderTenancies()}
            {portfolioProperties.length > 0 && this.renderPortfolio()}
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

  private renderTenancies = (): React.ReactElement => {
    const { t } = this.props;
    const { tenancies, expandedAssetId } = this.state;

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        <FlatList data={tenancies} renderItem={this.renderList} extraData={expandedAssetId} />
      </>
    );
  };

  private renderPortfolio = (): React.ReactElement => {
    const { t } = this.props;
    const { portfolioProperties, expandedAssetId } = this.state;

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
        <FlatList data={portfolioProperties} renderItem={this.renderList} extraData={expandedAssetId} />
      </>
    );
  };

  private renderList = ({ item, index }: { item: Asset; index: number }): React.ReactElement => {
    const { expandedAssetId } = this.state;
    return (
      <AssetCard
        assetData={item}
        key={index}
        expandedId={expandedAssetId}
        onViewProperty={this.onViewProperty}
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
    this.setState({ selectedFilter: value }, (): void => {
      this.getPortfolioProperty(true).then();
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

  private onViewProperty = (data: Asset): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyDetailScreen, { propertyData: data });
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
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
      this.setState({ selectedFilter: route.params.filter }, () => {
        this.getPortfolioProperty().then();
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

  private getTenancies = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: Asset[] = await PortfolioRepository.getUserTenancies();
      this.setState({ tenancies: response, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getPortfolioProperty = async (isFromFilter?: boolean): Promise<void> => {
    const { selectedFilter } = this.state;
    if (isFromFilter) {
      this.setState({ isSpinnerLoading: true });
    } else {
      this.setState({ isLoading: true });
    }
    try {
      const response: Asset[] = await PortfolioRepository.getUserAssetDetails(selectedFilter);
      this.setState({ portfolioProperties: response });
      if (isFromFilter) {
        this.setState({ isSpinnerLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (e) {
      if (isFromFilter) {
        this.setState({ isSpinnerLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
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
    const { navigation } = this.props;
    const { tenancies, portfolioProperties } = this.state;
    if (tenancies.length === 0 && portfolioProperties.length === 0) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.PropertyPostLandingScreen }],
        })
      );
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio);

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
