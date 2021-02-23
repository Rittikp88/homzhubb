import React, { PureComponent } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty } from 'lodash';
import { TabBar, TabView } from 'react-native-tab-view';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { FullScreenAssetDetailsCarousel, HeaderCard } from '@homzhub/mobile/src/components';
import DropdownModal, { IMenu } from '@homzhub/mobile/src/components/molecules/DropdownModal';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { AssetReviews } from '@homzhub/mobile/src/components/organisms/AssetReviews';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import DetailTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DetailTab';
import DummyView from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DummyView';
import Documents from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';
import TenantHistoryScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
  IPropertyDetailPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IBookVisitProps,
  NavigationScreenProps,
  ScreensKeys,
  UpdatePropertyFormTypes,
} from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs, Routes } from '@homzhub/common/src/constants/Tabs';
import { ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

enum MenuItems {
  EDIT_LISTING = 'EDIT_LISTING',
  EDIT_PROPERTY = 'EDIT_PROPERTY',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
  MANAGE_TENANT = 'MANAGE_TENANT',
}

interface IStateProps {
  assetPayload: ISetAssetPayload;
}

interface IDispatchProps {
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  getAssetById: () => void;
  clearAsset: () => void;
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

export class PropertyDetailScreen extends PureComponent<Props, IDetailState> {
  public focusListener: any;

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

  public componentDidMount = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    if (params && params.tabKey) {
      this.setState({
        currentIndex: Routes.findIndex((item) => item.key === params.tabKey),
      });
    }

    this.focusListener = navigation.addListener('focus', () => {
      this.getAssetDetail().then();
    });
  };

  public componentWillUnmount(): void {
    const { clearAsset } = this.props;
    this.focusListener();
    clearAsset();
  }

  public render = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { propertyData, isLoading, isMenuVisible, scrollEnabled, isDeleteProperty } = this.state;
    if (isLoading) {
      return <Loader visible />;
    }

    if (isEmpty(propertyData)) {
      return null;
    }

    const { assetStatusInfo } = propertyData;
    const isOccupied = assetStatusInfo?.tag.label === Filters.OCCUPIED;
    const menuItems = this.getMenuList(assetStatusInfo?.isListingPresent ?? false, isOccupied);
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void =>
      this.handleAction(propertyData, payload, param);

    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    const isMenuIconVisible = assetStatusInfo?.tag.label !== Filters.RENEWAL && menuItems.length > 0;

    return (
      <TouchableWithoutFeedback onPress={this.onCloseMenu}>
        <View style={styles.flexOne}>
          <UserScreen scrollEnabled={scrollEnabled} title={title} backgroundColor={theme.colors.background}>
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
                onHandleAction={onPressAction}
                containerStyle={styles.card}
              />
              {this.renderTabView()}
            </View>
          </UserScreen>
          {this.renderFullscreenCarousel()}
          <DropdownModal isVisible={isMenuVisible} data={menuItems} onSelect={this.onSelectMenuItem} />
          <BottomSheet
            visible={isDeleteProperty}
            headerTitle={t('property:deleteProperty')}
            sheetHeight={460}
            onCloseSheet={this.onCloseDeleteView}
          >
            <PropertyConfirmationView
              propertyData={propertyData}
              description={t('deletePropertyDescription')}
              message={t('deleteConfirmation')}
              onCancel={this.onCloseDeleteView}
              onContinue={(): Promise<void> => this.onDeleteProperty(propertyData.id)}
            />
          </BottomSheet>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  private renderTabView = (): React.ReactElement | null => {
    const {
      route: { params },
    } = this.props;
    const { currentIndex, heights } = this.state;

    if (params && params.isFromTenancies) {
      return null;
    }

    return (
      <TabView
        lazy
        swipeEnabled={false}
        style={{ height: heights[currentIndex] }}
        initialLayout={TAB_LAYOUT}
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
                  <Icon name={route.icon} color={isSelected ? theme.colors.blue : theme.colors.darkTint3} size={22} />
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
            <AssetReviews
              leaseListingId={assetStatusInfo?.leaseListingId ?? null}
              saleListingId={assetStatusInfo?.saleListingId ?? null}
            />
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
      arrayToUpdate[index] = newHeight * 1.3;
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
        assetStatusInfo,
      },
    } = this.state;
    setSelectedPlan({ id, selectedPlan: type });
    setAssetId(id);
    getAssetById();

    this.onCloseMenu();

    if (value === MenuItems.EDIT_LISTING) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.AssetListing,
        params: { previousScreen: ScreensKeys.Dashboard, isEditFlow: true },
      });
      return;
    }

    if (value === MenuItems.EDIT_PROPERTY) {
      let params;
      setEditPropertyFlow(true);
      if (assetStatusInfo && assetStatusInfo.status) {
        params = {
          status: assetStatusInfo.status,
        };
        if (assetStatusInfo.status === 'APPROVED') {
          toggleEditPropertyFlowBottomSheet(true);
        }
      }
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.PostAssetDetails,
        ...(params && { params }),
      });
    }

    if (value === MenuItems.DELETE_PROPERTY) {
      this.setState({
        isDeleteProperty: true,
      });
    }

    if (value === MenuItems.MANAGE_TENANT) {
      const { propertyData } = this.state;
      navigation.navigate(ScreensKeys.ManageTenantScreen, {
        assetDetail: propertyData,
      });
    }
  };

  private navigateToBookVisit = (param: IBookVisitProps, isNew?: boolean): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.BookVisit, {
      isReschedule: !isNew,
      ...param,
    });
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

  private getMenuList = (isListingCreated: boolean, isOccupied: boolean): IMenu[] => {
    const {
      t,
      route: { params },
    } = this.props;
    let list;
    if (params && params.isFromTenancies) {
      return [];
    }

    if (params && isOccupied) {
      list = [{ label: t('property:manageTenants'), value: MenuItems.MANAGE_TENANT }];
      return list;
    }

    list = [
      { label: t('property:editProperty'), value: MenuItems.EDIT_PROPERTY },
      { label: t('property:deleteProperty'), value: MenuItems.DELETE_PROPERTY },
    ];

    if (isListingCreated) {
      list.splice(1, 0, { label: t('property:editListing'), value: MenuItems.EDIT_LISTING });
    }

    return list;
  };

  private handleAction = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { navigation, setAssetId } = this.props;
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formType = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    const { id } = asset;

    setAssetId(id);

    if (param && param.hasTakeAction) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyPostStack, {
        screen: ScreensKeys.AssetPlanSelection,
        param: { isFromPortfolio: true },
      });
    } else {
      navigation.navigate(ScreensKeys.UpdatePropertyScreen, { formType, payload, param, assetDetail: asset });
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
  const { clearAsset } = AssetActions;
  return bindActionCreators(
    { setAssetId, setSelectedPlan, getAssetById, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet, clearAsset },
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
