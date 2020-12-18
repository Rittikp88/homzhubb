import React, { Component } from 'react';
import { LayoutChangeEvent, PickerItemProps, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty } from 'lodash';
import { TabBar, TabView } from 'react-native-tab-view';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import {
  AnimatedProfileHeader,
  BottomSheet,
  FullScreenAssetDetailsCarousel,
  HeaderCard,
  Loader,
} from '@homzhub/mobile/src/components';
import DropdownModal from '@homzhub/mobile/src/components/molecules/DropdownModal';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
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
  DELETE_PROPERTY = 'DELETE_PROPERTY',
}

export interface IEditPropertyFlow {
  isEditPropertyFlow: boolean;
  showBottomSheet: boolean;
}

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
  isDeleteProperty: boolean;
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
    isDeleteProperty: false,
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
      scrollEnabled,
      isDeleteProperty,
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

    const menuItems = this.getMenuList(isListingCreated);

    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    const isMenuIconVisible = assetStatusInfo?.tag.label !== Filters.OCCUPIED;
    return (
      <TouchableWithoutFeedback onPress={this.onCloseMenu}>
        <View style={styles.flexOne}>
          <AnimatedProfileHeader isOuterScrollEnabled={scrollEnabled} title={title}>
            <View onStartShouldSetResponder={this.handleResponder}>
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
            </View>
          </AnimatedProfileHeader>
          {this.renderFullscreenCarousel()}
          <DropdownModal isVisible={isMenuVisible} data={menuItems} onSelect={this.onSelectMenuItem} />
          <BottomSheet
            visible={isDeleteProperty}
            headerTitle={t('property:deleteProperty')}
            sheetHeight={400}
            onCloseSheet={this.onCloseDeleteView}
          >
            <PropertyConfirmationView
              propertyData={propertyData}
              description={t('deletePropertyDescription')} // TODO: Replace with proper text
              message={t('deleteConfirmation')}
              onCancel={this.onCloseDeleteView}
              onContinue={(): Promise<void> => this.onDeleteProperty(propertyData.id)}
            />
          </BottomSheet>
        </View>
      </TouchableWithoutFeedback>
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
    // @ts-ignore
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
    const { navigation, setAssetId, setEditPropertyFlow } = this.props;
    setAssetId(assetId);
    setEditPropertyFlow(true);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private onCloseMenu = (): void => {
    this.setState({ isMenuVisible: false });
  };

  private onCloseDeleteView = (): void => {
    this.setState({
      isDeleteProperty: false,
    });
  };

  private onDeleteProperty = async (id: number): Promise<void> => {
    const { navigation } = this.props;
    try {
      await AssetRepository.deleteAsset(id);
      this.setState(
        {
          isDeleteProperty: false,
        },
        () => {
          navigation.navigate(ScreensKeys.PortfolioLandingScreen);
        }
      );
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
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

    this.onCloseMenu();

    if (value === MenuItems.EDIT_LISTING) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.AssetLeaseListing,
        params: { previousScreen: ScreensKeys.Dashboard, isEditFlow: true },
      });
      return;
    }

    if (value === MenuItems.EDIT_PROPERTY) {
      setEditPropertyFlow(true);
      toggleEditPropertyFlowBottomSheet(true);
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.PostAssetDetails,
      });
    }

    if (value === MenuItems.DELETE_PROPERTY) {
      this.setState({
        isDeleteProperty: true,
      });
    }
  };

  private navigateToBookVisit = (isNew?: boolean): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.BookVisit, { isReschedule: !isNew });
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private handleResponder = (): boolean => {
    this.setState({
      isMenuVisible: false,
    });

    return true;
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

  private getMenuList = (isListingCreated: boolean): PickerItemProps[] => {
    const { t } = this.props;
    const list = [
      { label: t('property:editProperty'), value: MenuItems.EDIT_PROPERTY },
      // TODO: Uncomment when delete API becomes ready
      // { label: t('property:deleteProperty'), value: MenuItems.DELETE_PROPERTY },
    ];

    if (isListingCreated) {
      list.splice(1, 0, { label: t('property:editListing'), value: MenuItems.EDIT_LISTING });
    }

    return list;
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleMenuIcon = (): void => {
    const { isMenuVisible } = this.state;
    this.setState({ isMenuVisible: !isMenuVisible });
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
  flexOne: {
    flex: 1,
  },
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
