import React from 'react';
import { FlatList, StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import {
  AssetAdvertisementBanner,
  AssetMetricsList,
  AssetSummary,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import VisitListCard from '@homzhub/mobile/src/components/organisms/VisitListCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IActions, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IMetricsData } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/DashboardStack';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { IAssetVisitPayload, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDispatchProps {
  setCurrentFilter: (payload: Filters) => void;
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  setAddPropertyFlow: (payload: boolean) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setInitialState: () => void;
  getAssetVisit: (payload: IAssetVisitPayload) => void;
}

interface IReduxStateProps {
  assets: Asset[];
}

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps & IDispatchProps & IReduxStateProps;

interface IDashboardState {
  metrics: IMetricsData;
  pendingProperties: Asset[];
  isLoading: boolean;
  showBottomSheet: boolean;
}

interface IFormattedBottomSheetData {
  icon: string;
  label: string;
  onPress: () => void;
}

enum MetricType {
  OFFER = 'OFFER',
  SITE_VISITS = 'SITE_VISIT',
  SHORTLISTED = 'SHORTLISTED',
}

const ShowInMvpRelease = false;

export class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public focusListener: any;
  public blurListener: any;

  public state = {
    metrics: {} as IMetricsData,
    pendingProperties: [],
    isLoading: false,
    showBottomSheet: false,
  };

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getScreenData().then();
    });
    this.blurListener = navigation.addListener('blur', () => {
      this.handleScreenBlur();
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
    this.blurListener();
  }

  public render = (): React.ReactElement => {
    const { t, route } = this.props;
    const { isLoading, pendingProperties, metrics } = this.state;

    return (
      <>
        <UserScreen loading={isLoading} isGradient title={t('dashboard')}>
          {this.renderAssetMetricsAndUpdates()}
          {pendingProperties.length > 0 && (
            <PendingPropertyListCard
              data={pendingProperties}
              onPressComplete={this.onCompleteDetails}
              onSelectAction={this.handleActionSelection}
              onViewProperty={this.onViewProperty}
            />
          )}
          {metrics?.isTenant && <VisitListCard />}
          {!metrics?.isTenant && <FinanceOverview />}
          <AssetMarketTrends isDashboard onViewAll={this.onViewAll} onTrendPress={this.onTrendPress} />
          <AssetAdvertisementBanner />
          {ShowInMvpRelease && <UserSubscriptionPlan onApiFailure={this.onAssetSubscriptionApiFailure} />}
          {this.renderBottomSheet()}
        </UserScreen>
        {Boolean(route?.params?.imageLink && route?.params?.imageLink?.length > 0) && this.renderFullImageView()}
      </>
    );
  };

  public renderAssetMetricsAndUpdates = (): React.ReactElement => {
    const { t } = this.props;
    const { metrics } = this.state;
    return (
      <>
        <AssetMetricsList
          title={`${metrics?.metricValues?.assets?.count ?? 0}`}
          data={metrics?.metricValues?.miscellaneous ?? []}
          subscription={metrics?.metricValues?.userServicePlan?.label}
          onMetricsClicked={this.handleMetricsNavigation}
          onPlusIconClicked={this.openBottomSheet}
          subTitleText={metrics?.isTenant ? t('assetPortfolio:tenancies') : t('common:properties')}
        />
        <AssetSummary
          notification={metrics?.updates?.notifications?.count ?? 0}
          serviceTickets={metrics?.updates?.tickets?.open?.count ?? 0}
          dues={metrics?.updates?.dues?.count ?? 0}
          messages={metrics?.updates?.messages?.unread?.count ?? 0}
          containerStyle={styles.assetCards()}
          onPressServiceTickets={this.handleServiceTickets}
          onPressNotification={this.handleNotification}
          onPressMessages={this.handleMessages}
        />
      </>
    );
  };

  public renderBottomSheet = (): React.ReactElement => {
    const { t, setInitialState } = this.props;
    const { showBottomSheet } = this.state;
    const data = this.formatBottomSheetData();

    const keyExtractor = (item: IFormattedBottomSheetData, index: number): string => `${item}:${index}`;

    const renderItem = ({ item, index }: { item: IFormattedBottomSheetData; index: number }): React.ReactElement => {
      const { icon, label, onPress } = item;

      const onPressItem = (): void => {
        onPress();
        setInitialState();
        this.closeBottomSheet();
      };
      return (
        <>
          <TouchableOpacity
            style={[styles.bottomSheetItemContainer(), index % 2 === 0 && styles.evenItem()]}
            onPress={onPressItem}
          >
            <Icon name={icon} size={25} color={theme.colors.blue} />
            <Text type="small" textType="regular" style={styles.itemLabel()}>
              {label}
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <BottomSheet
        headerTitle={t('common:addCamelCase')}
        visible={showBottomSheet}
        onCloseSheet={this.closeBottomSheet}
        sheetHeight={375}
      >
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.flatList()}
        />
      </BottomSheet>
    );
  };

  public renderFullImageView = (): React.ReactElement | null => {
    const { route } = this.props;

    if (route?.params?.imageLink) {
      const imageLink = ObjectMapper.deserialize(Attachment, { link: route?.params?.imageLink });

      const onPressCross = (): void => {
        this.handleScreenBlur();
      };

      return (
        <>
          <FullScreenAssetDetailsCarousel
            data={[imageLink]}
            activeSlide={0}
            onFullScreenToggle={onPressCross}
            hasOnlyImages
          />
        </>
      );
    }

    return null;
  };

  // HANDLERS
  private onAssetSubscriptionApiFailure = (err: IApiClientError): void => {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(err) });
  };

  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId } = this.props;
    setAssetId(assetId);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private onViewAll = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarketTrends, { isFromDashboard: true });
  };

  private onTrendPress = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };

  private onViewProperty = (data: ISetAssetPayload): void => {
    const { setCurrentAsset, navigation } = this.props;
    setCurrentAsset(data);
    navigation.navigate(ScreensKeys.PropertyDetailScreen);
  };

  private handleScreenBlur = (): void => {
    const { navigation } = this.props;
    navigation.setParams({ imageLink: undefined });
  };

  private handleMessages = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Messages, { isFromDashboard: true });
  };

  private handleServiceTickets = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ServiceTicketScreen, { isFromDashboard: true });
  };

  private handleNotification = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AssetNotifications, { isFromDashboard: true });
  };

  private handleMetricsNavigation = (name: string): void => {
    const { navigation, setCurrentFilter, t } = this.props;

    const handleNavigation = (): void => {
      const callNavigation = (screen: ScreensKeys): void =>
        // @ts-ignore
        navigation.navigate(screen, { screenTitle: t('assetDashboard:dashboard') });

      switch (name) {
        case MetricType.OFFER:
          callNavigation(ScreensKeys.PropertyOfferList);
          break;
        case MetricType.SHORTLISTED:
          callNavigation(ScreensKeys.SavedPropertiesScreen);
          break;
        case MetricType.SITE_VISITS:
          callNavigation(ScreensKeys.PropertyVisits);
          break;
        default:
          FunctionUtils.noop();
      }
    };

    if ([MetricType.OFFER, MetricType.SHORTLISTED, MetricType.SITE_VISITS].includes(name as MetricType)) {
      handleNavigation();
      return;
    }
    setCurrentFilter(name as Filters);
    // @ts-ignore
    navigation.navigate(ScreensKeys.Portfolio, {
      screen: ScreensKeys.PortfolioLandingScreen,
      params: {
        isFromNavigation: true,
      }
    });
  };

  private handleActionSelection = (item: IActions, assetId: number): void => {
    const { navigation, setSelectedPlan, setAssetId } = this.props;
    setSelectedPlan({ id: item.id, selectedPlan: item.type });
    setAssetId(assetId);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetListing,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private openBottomSheet = (): void => this.setState({ showBottomSheet: true });

  private closeBottomSheet = (): void => this.setState({ showBottomSheet: false });

  private formatBottomSheetData = (): IFormattedBottomSheetData[] => {
    const { t, navigation, assets } = this.props;

    const handleAddProperty = (): void => {
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
      AnalyticsService.track(EventType.AddPropertyInitiation);
    };

    const handleAddFinancialRecord = (): void => {
      if (assets.length <= 0) {
        AlertHelper.error({ message: t('assetFinancial:addProperty') });
        return;
      }
      navigation.navigate(ScreensKeys.AddRecordScreen, { isFromDashboard: true });
    };

    const handleAddServiceTicket = (): void => {
      if (assets.length <= 0) {
        AlertHelper.error({ message: t('assetDashboard:addPropertyForTicket') });
        return;
      }
      navigation.navigate(ScreensKeys.AddServiceTicket, { isFromDashboard: true });
    };

    const handleAddSupportTicket = (): void => {
      navigation.navigate(ScreensKeys.SupportScreen, { isFromDashboard: true });
    };

    return [
      {
        icon: icons.portfolioFilled,
        label: t('assetFinancial:property'),
        onPress: handleAddProperty,
      },
      {
        icon: icons.barChartFilled,
        label: t('assetDashboard:incomeOrExpense'),
        onPress: handleAddFinancialRecord,
      },
      {
        icon: icons.serviceTicket,
        label: t('assetDashboard:serviceTicket'),
        onPress: handleAddServiceTicket,
      },
      {
        icon: icons.supportTicket,
        label: t('assetDashboard:supportTicket'),
        onPress: handleAddSupportTicket,
      },
    ];
  };

  // HANDLERS end

  // APIs
  private getScreenData = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getPendingProperties();
    this.getVisitData();
  };

  private getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const { metricsData } = await DashboardRepository.getAssetMetrics('v4');
      this.setState({ metrics: metricsData, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getPendingProperties = async (): Promise<void> => {
    try {
      const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
      this.setState({ pendingProperties: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getVisitData = (): void => {
    const { getAssetVisit } = this.props;
    getAssetVisit({
      start_date__gte: new Date().toISOString(),
      status__in: `${VisitStatus.APPROVED},${VisitStatus.PENDING}`,
    });
  };
  // APIs end
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentFilter, setCurrentAsset, setInitialState } = PortfolioActions;
  const { setAddPropertyFlow } = UserActions;
  const { setAssetId, setSelectedPlan } = RecordAssetActions;
  const { getAssetVisit } = AssetActions;
  return bindActionCreators(
    {
      setCurrentFilter,
      setAssetId,
      setSelectedPlan,
      setAddPropertyFlow,
      setCurrentAsset,
      setInitialState,
      getAssetVisit,
    },
    dispatch
  );
};

const mapStateToProps = (state: IState): IReduxStateProps => {
  const { getUserAssets } = UserSelector;
  return {
    assets: getUserAssets(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard));

const styles = {
  assetCards: (): StyleProp<ViewStyle> => ({
    marginVertical: 12,
  }),
  evenItem: (): StyleProp<ViewStyle> => ({
    marginEnd: 17,
  }),
  bottomSheetItemContainer: (): StyleProp<ViewStyle> => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
  }),
  itemLabel: (): StyleProp<TextStyle> => ({
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.blue,
  }),
  flatList: (): StyleProp<ViewStyle> => ({
    marginBottom: 30,
    marginHorizontal: 24,
  }),
};
