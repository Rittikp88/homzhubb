import React, { Component } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty } from 'lodash';
import { TabBar, TabView } from 'react-native-tab-view';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import {
  AnimatedProfileHeader,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
  HeaderCard,
  Loader,
} from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import DetailTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DetailTab';
import DummyView from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DummyView';
import Documents from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';
import TenantHistoryScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IPropertyDetailPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs, Routes } from '@homzhub/common/src/constants/Tabs';
import { ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';

const { height } = theme.viewport;

enum MenuItems {
  EDIT_LISTING = 'EDIT_LISTING',
  EDIT_PROPERTY = 'EDIT_PROPERTY',
}

export interface IEditPropertyFlow {
  isEditPropertyFlow: boolean;
  showBottomSheet: boolean;
}

// TODO: Need Refactor
const menuItems = [
  { label: 'Edit Listing', value: MenuItems.EDIT_LISTING },
  { label: 'Edit Property', value: MenuItems.EDIT_PROPERTY },
];

interface IStateProps {
  assetPayload: ISetAssetPayload;
}

interface IDispatchProps {
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  getAssetById: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
}

interface IDetailState {
  propertyData: Asset;
  attachments: Attachment[];
  isFullScreen: boolean;
  activeSlide: number;
  currentIndex: number;
  heights: number[];
  isLoading: boolean;
  isMenuVisible: boolean;
  selectedMenuItem: string;
  scrollEnabled: boolean;
}

interface IRoutes {
  key: string;
  title: string;
  icon: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class PropertyDetailScreen extends Component<Props, IDetailState> {
  public state = {
    propertyData: {} as Asset,
    isFullScreen: false,
    activeSlide: 0,
    attachments: [],
    currentIndex: 0,
    heights: Array(Routes.length).fill(height),
    isLoading: false,
    isMenuVisible: false,
    scrollEnabled: true,
    selectedMenuItem: '',
  };

  public componentDidMount = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    if (params && params.tabKey) {
      this.setState({
        currentIndex: Routes.findIndex((item) => item.key === params.tabKey),
      });
    }
    await this.getAssetDetail();
  };

  public render = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const {
      currentIndex,
      propertyData,
      heights,
      isLoading,
      isMenuVisible,
      selectedMenuItem,
      scrollEnabled,
    } = this.state;

    if (isLoading) {
      return <Loader visible />;
    }

    if (isEmpty(propertyData)) {
      return null;
    }

    const {
      lastVisitedStep: {
        listing: { isListingCreated },
      },
      assetStatusInfo,
    } = propertyData;

    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    const isMenuIconVisible = assetStatusInfo?.tag.label !== Filters.OCCUPIED && isListingCreated;
    return (
      <>
        <AnimatedProfileHeader isOuterScrollEnabled={scrollEnabled} title={title}>
          <>
            <HeaderCard
              title={t('propertyDetails')}
              onIconPress={this.handleIconPress}
              handleIcon={this.handleMenuIcon}
              titleFontWeight="semiBold"
              titleTextSize="small"
              iconSize={18}
              iconBackSize={24}
              icon={isMenuIconVisible ? icons.verticalDots : ''}
            />
            <AssetCard
              assetData={propertyData}
              isDetailView
              isFromTenancies={params?.isFromTenancies ?? false}
              enterFullScreen={this.onFullScreenToggle}
              onCompleteDetails={this.onCompleteDetails}
              onOfferVisitPress={FunctionUtils.noop}
              containerStyle={styles.card}
            />
            <TabView
              swipeEnabled={false}
              style={{ height: heights[currentIndex] }}
              initialLayout={theme.viewport}
              renderScene={({ route }): React.ReactElement | null => this.renderTabScene(route)}
              onIndexChange={this.handleIndexChange}
              renderTabBar={(props): React.ReactElement => {
                const {
                  navigationState: { index, routes },
                } = props;
                const currentRoute = routes[index];
                return (
                  <TabBar
                    {...props}
                    scrollEnabled
                    style={{ backgroundColor: theme.colors.white }}
                    indicatorStyle={{ backgroundColor: theme.colors.blue }}
                    renderIcon={({ route }): React.ReactElement => {
                      const isSelected = currentRoute.key === route.key;
                      return (
                        <Icon
                          name={route.icon}
                          color={isSelected ? theme.colors.blue : theme.colors.darkTint3}
                          size={22}
                        />
                      );
                    }}
                    renderLabel={({ route }): React.ReactElement => {
                      const isSelected = currentRoute.key === route.key;
                      return (
                        <Text
                          type="small"
                          style={[
                            styles.label,
                            isSelected && {
                              color: theme.colors.blue,
                            },
                          ]}
                        >
                          {route.title}
                        </Text>
                      );
                    }}
                  />
                );
              }}
              navigationState={{
                index: currentIndex,
                routes: Routes,
              }}
            />
          </>
        </AnimatedProfileHeader>
        {this.renderFullscreenCarousel()}
        <BottomSheetListView
          data={menuItems}
          selectedValue={selectedMenuItem}
          listTitle="Select action"
          listHeight={200}
          isBottomSheetVisible={isMenuVisible}
          onCloseDropDown={this.onCloseMenu}
          onSelectItem={this.onSelectMenuItem}
        />
      </>
    );
  };

  private renderTabScene = (route: IRoutes): React.ReactElement | null => {
    const {
      navigation,
      route: { params },
      t,
    } = this.props;
    const {
      propertyData: { id, assetStatusInfo, isManaged },
    } = this.state;
    switch (route.key) {
      case Tabs.NOTIFICATIONS:
        // TODO: Figure-out something to resolve this error
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <NotificationTab isManagedProperty={isManaged} assetStatusInfo={assetStatusInfo} />
          </View>
        );
      case Tabs.TICKETS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <DummyView />
          </View>
        );
      case Tabs.OFFERS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <DummyView />
          </View>
        );
      case Tabs.REVIEWS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 3)}>
            <DummyView />
          </View>
        );
      case Tabs.SITE_VISITS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 4)}>
            <SiteVisitTab onReschedule={this.navigateToBookVisit} navigation={navigation} isFromProperty />
          </View>
        );
      case Tabs.FINANCIALS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 5)} style={styles.background}>
            <Button
              type="secondary"
              title={t('assetFinancial:addNewRecord')}
              containerStyle={styles.addRecordButton}
              onPress={this.onRecordAdd}
            />
            <TransactionCardsContainer selectedProperty={id} shouldEnableOuterScroll={this.toggleScroll} />
          </View>
        );
      case Tabs.MESSAGES:
        return (
          <View onLayout={(e): void => this.onLayout(e, 6)}>
            <DummyView />
          </View>
        );
      case Tabs.DOCUMENTS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 7)}>
            <Documents />
          </View>
        );
      case Tabs.TENANT_HISTORY:
        return (
          <View onLayout={(e): void => this.onLayout(e, 8)}>
            <TenantHistoryScreen isFromTenancies={params?.isFromTenancies ?? false} />
          </View>
        );
      case Tabs.DETAILS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 9)}>
            <DetailTab assetStatusInfo={assetStatusInfo} />
          </View>
        );
      default:
        return null;
    }
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

  private onFullScreenToggle = (attachments?: Attachment[]): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
    if (attachments) {
      this.setState({ attachments });
    }
  };

  private onRecordAdd = (): void => {
    const {
      propertyData: { id },
    } = this.state;
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AddRecordScreen, { assetId: id });
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];
    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight * 1.5;
      this.setState({ heights: arrayToUpdate });
    }
  };

  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId } = this.props;
    setAssetId(assetId);
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private onCloseMenu = (): void => {
    this.setState({ isMenuVisible: false });
  };

  private onSelectMenuItem = (value: string): void => {
    const {
      navigation,
      setSelectedPlan,
      setAssetId,
      getAssetById,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
    } = this.props;
    const {
      propertyData: {
        id,
        lastVisitedStep: {
          listing: { type },
        },
      },
    } = this.state;
    setSelectedPlan({ id, selectedPlan: type });
    setAssetId(id);
    getAssetById();

    if (value === MenuItems.EDIT_LISTING) {
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.AssetLeaseListing,
        params: { previousScreen: ScreensKeys.Dashboard, isEditFlow: true },
      });
      return;
    }

    if (value === MenuItems.EDIT_PROPERTY) {
      setEditPropertyFlow(true);
      toggleEditPropertyFlowBottomSheet(true);
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.PostAssetDetails,
      });
    }

    this.onCloseMenu();
  };

  private navigateToBookVisit = (isNew?: boolean): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack, {
      screen: ScreensKeys.BookVisit,
      params: { isReschedule: !isNew },
    });
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private getAssetDetail = async (): Promise<void> => {
    const {
      assetPayload: { asset_id, assetType, listing_id },
    } = this.props;
    const payload: IPropertyDetailPayload = {
      asset_id,
      id: listing_id,
      type: assetType,
    };
    this.setState({ isLoading: true });
    try {
      const response = await PortfolioRepository.getPropertyDetail(payload);
      this.setState({
        propertyData: response,
        isLoading: false,
      });
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleMenuIcon = (): void => {
    this.setState({ isMenuVisible: true });
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    setAssetId,
    setSelectedPlan,
    getAssetById,
    setEditPropertyFlow,
    toggleEditPropertyFlowBottomSheet,
  } = RecordAssetActions;
  return bindActionCreators(
    { setAssetId, setSelectedPlan, getAssetById, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen));

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
  },
  label: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  addRecordButton: {
    flex: 0,
    marginTop: 16,
    marginHorizontal: 16,
    borderStyle: 'dashed',
  },
  background: {
    backgroundColor: theme.colors.white,
  },
});
