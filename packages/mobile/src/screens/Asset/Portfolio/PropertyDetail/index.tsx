import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { FullScreenAssetDetailsCarousel } from '@homzhub/mobile/src/components';
import Menu, { IMenu } from '@homzhub/mobile/src/components/molecules/Menu';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
  IPropertyDetailPayload,
  ListingType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Routes, Tabs, IRoutes } from '@homzhub/common/src/constants/Tabs';
import { ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { ICurrentOffer, IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { IGetAssetPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';

enum MenuItems {
  EDIT_LISTING = 'EDIT_LISTING',
  EDIT_PROPERTY = 'EDIT_PROPERTY',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
  MANAGE_TENANT = 'MANAGE_TENANT',
  EDIT_LEASE = 'EDIT_LEASE',
}

interface IStateProps {
  assetPayload: ISetAssetPayload;
  asset: Asset | null;
}

interface IDispatchProps {
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  getAssetById: () => void;
  clearAsset: () => void;
  clearChatDetail: () => void;
  clearMessages: () => void;
  clearState: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
  setCurrentChatDetail: (payload: IChatPayload) => void;
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
  getAsset: (payload: IGetAssetPayload) => void;
  setFilter: (payload: IFilter) => void;
  setCompareDetail: (payload: IOfferCompare) => void;
}

interface IDetailState {
  propertyData: Asset;
  attachments: Attachment[];
  isFullScreen: boolean;
  activeSlide: number;
  isLoading: boolean;
  isDeleteProperty: boolean;
  isFromTenancies: boolean | null;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class PropertyDetailScreen extends PureComponent<Props, IDetailState> {
  public focusListener: any;

  constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    this.state = {
      propertyData: {} as Asset,
      isFullScreen: false,
      activeSlide: 0,
      attachments: [],
      isLoading: false,
      isDeleteProperty: false,
      isFromTenancies: params?.isFromTenancies ?? null,
    };
  }

  public componentDidMount = (): void => {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.getAssetDetail().then();
    });
  };

  public componentDidUpdate = (prevProps: Readonly<Props>): void => {
    const { asset, setCompareDetail } = this.props;
    if (JSON.stringify(asset) !== JSON.stringify(prevProps.asset)) {
      if (asset && asset.leaseTerm) {
        setCompareDetail({
          rent: asset.leaseTerm.expectedPrice,
          deposit: asset.leaseTerm.securityDeposit,
          incrementPercentage: asset.leaseTerm.annualRentIncrementPercentage ?? 0,
        });
      }

      if (asset && asset.saleTerm) {
        setCompareDetail({
          price: Number(asset.saleTerm.expectedPrice) ?? 0,
          bookingAmount: Number(asset.saleTerm.expectedBookingAmount) ?? 0,
        });
      }
    }
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
    const { propertyData, isLoading, isDeleteProperty, isFromTenancies } = this.state;

    const { assetStatusInfo, id } = propertyData;
    const isOccupied = assetStatusInfo?.tag.label === Filters.OCCUPIED;
    const menuItems = this.getMenuList(assetStatusInfo?.isListingPresent ?? false, isOccupied);
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void =>
      this.handleAction(propertyData, payload, param);

    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    const isMenuIconVisible = assetStatusInfo?.tag.label !== Filters.EXPIRING && menuItems.length > 0;

    return (
      <View style={styles.flexOne}>
        <UserScreen
          title={title}
          scrollEnabled
          pageTitle={t('propertyDetails')}
          backgroundColor={theme.colors.background}
          headerStyle={styles.background}
          loading={isLoading}
          onBackPress={this.handleIconPress}
          rightNode={isMenuIconVisible ? this.renderRightNode(menuItems) : undefined}
          keyboardShouldPersistTaps
        >
          {!isEmpty(propertyData) ? (
            <>
              <AssetCard
                assetData={propertyData}
                isDetailView
                isFromTenancies={isFromTenancies ?? undefined}
                enterFullScreen={this.onFullScreenToggle}
                onCompleteDetails={this.onCompleteDetails}
                onOfferVisitPress={FunctionUtils.noop}
                onHandleAction={onPressAction}
                containerStyle={styles.card}
              />
              {this.renderTabView()}
              {!isFromTenancies && <NotificationTab propertyId={id} assetStatusInfo={assetStatusInfo} />}
            </>
          ) : (
            <EmptyState title={t('common:noDataAvailable')} icon={icons.portfolio} />
          )}
        </UserScreen>
        {this.renderFullscreenCarousel()}
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
    );
  };

  private renderRightNode = (menuItems: IMenu[]): React.ReactElement => {
    const { t } = this.props;
    return <Menu data={menuItems} onSelect={this.onSelectMenuItem} optionTitle={t('property:propertyOption')} />;
  };

  private renderTabView = (): React.ReactElement | null => {
    const { isFromTenancies } = this.state;

    if (isFromTenancies) {
      return null;
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabView}>
        {Routes.map((route: IRoutes, index) => {
          return (
            <TouchableOpacity key={index} style={styles.tabItem} onPress={(): void => this.handleTabAction(route.key)}>
              <Icon name={route.icon || ''} color={theme.colors.darkTint3} size={26} />
              <Text type="small" style={styles.label}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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

  private onFullScreenToggle = (attachments?: Attachment[]): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
    if (attachments) {
      this.setState({ attachments });
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

  private onCloseDeleteView = (): void => {
    this.setState({
      isDeleteProperty: false,
    });
  };

  private onDeleteProperty = async (id: number): Promise<void> => {
    const { t, navigation } = this.props;
    this.setState({ isLoading: true });
    try {
      await AssetRepository.deleteAsset(id);
      this.setState(
        {
          isDeleteProperty: false,
          isLoading: false,
        },
        () => {
          AlertHelper.success({ message: t('property:propertyDeleted') });
          navigation.goBack();
        }
      );
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      this.setState({ isDeleteProperty: false, isLoading: false });
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
        assetGroup,
      },
      propertyData,
    } = this.state;
    let params;
    setSelectedPlan({ id, selectedPlan: type });
    setAssetId(id);
    getAssetById();

    switch (value) {
      case MenuItems.EDIT_LISTING:
        // @ts-ignore
        navigation.navigate(ScreensKeys.PropertyPostStack, {
          screen: ScreensKeys.AssetListing,
          params: { previousScreen: ScreensKeys.Dashboard, isEditFlow: true },
        });
        break;
      case MenuItems.EDIT_PROPERTY:
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
        break;
      case MenuItems.DELETE_PROPERTY:
        this.setState({
          isDeleteProperty: true,
        });
        break;
      case MenuItems.MANAGE_TENANT:
        navigation.navigate(ScreensKeys.ManageTenantScreen, {
          assetDetail: propertyData,
        });
        break;
      case MenuItems.EDIT_LEASE:
        if (assetStatusInfo?.leaseTransaction) {
          navigation.navigate(ScreensKeys.UpdateLeaseScreen, {
            transactionId: assetStatusInfo.leaseTransaction.id,
            assetGroup: assetGroup.code,
            user: assetStatusInfo.leaseTenantInfo.user,
          });
        }
        break;
      default:
        FunctionUtils.noop();
    }
  };

  private handleTabAction = (key: Tabs): void => {
    const { navigation } = this.props;
    const { propertyData, isFromTenancies } = this.state;
    if (isEmpty(propertyData)) {
      return;
    }
    const { formattedProjectName, id, assetStatusInfo } = propertyData;

    const param = {
      isFromPortfolio: true,
      isFromTenancies: isFromTenancies ?? false,
      screenTitle: formattedProjectName,
      propertyId: id,
    };
    switch (key) {
      case Tabs.TICKETS:
        navigation.navigate(ScreensKeys.ServiceTicketScreen, param);
        break;
      case Tabs.OFFERS:
        navigation.navigate(ScreensKeys.OfferDetail, param);
        break;
      case Tabs.REVIEWS:
        navigation.navigate(ScreensKeys.AssetReviewScreen, {
          ...param,
          leaseListingId: assetStatusInfo?.leaseListingId ?? null,
          saleListingId: assetStatusInfo?.saleListingId ?? null,
        });
        break;
      case Tabs.SITE_VISITS:
        navigation.navigate(ScreensKeys.PropertyVisits, param);
        break;
      case Tabs.FINANCIALS:
        navigation.navigate(ScreensKeys.AssetFinancialScreen, param);
        break;
      case Tabs.MESSAGES:
        navigation.navigate(ScreensKeys.ChatScreen, param);
        break;
      case Tabs.DOCUMENTS:
        navigation.navigate(ScreensKeys.DocumentScreen, param);
        break;
      case Tabs.TENANT_HISTORY:
        navigation.navigate(ScreensKeys.TenantHistoryScreen, param);
        break;
      case Tabs.DETAILS:
        navigation.navigate(ScreensKeys.AssetDetailScreen, { ...param, property: propertyData });
        break;
      default:
        navigation.navigate(ScreensKeys.ComingSoonScreen, { title: key, tabHeader: formattedProjectName });
    }
  };

  private getAssetDetail = async (): Promise<void> => {
    const {
      assetPayload: { asset_id, assetType, listing_id },
      setCurrentChatDetail,
      setCurrentOfferPayload,
      getAsset,
      setFilter,
    } = this.props;

    if (!asset_id) {
      return;
    }

    const payload: IPropertyDetailPayload = {
      asset_id,
      id: listing_id,
      type: assetType,
    };
    this.setState({ isLoading: true });
    try {
      const response = await PortfolioRepository.getPropertyDetail(payload);
      const info = response.assetStatusInfo;
      this.clearStates();
      this.setState(
        {
          propertyData: response,
          isLoading: false,
          isFromTenancies: !response.isAssetOwner,
        },
        () => {
          if (info && info.leaseTransaction && info.leaseTransaction.id > 0) {
            setCurrentChatDetail({
              groupName: response.projectName,
              groupId: info.leaseTransaction.messageGroupId,
            });
          }

          if (info && (info.leaseListingId || info.saleListingId)) {
            setCurrentOfferPayload({
              type: info.leaseListingId ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
              listingId: info.leaseListingId || info.saleListingId || 0,
            });
            setFilter({ asset_transaction_type: info.leaseListingId && info.leaseListingId > 0 ? 0 : 1 });
            getAsset({ propertyTermId: info.leaseListingId || info.saleListingId || 0 });
          }
        }
      );
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
    const { isFromTenancies } = this.state;
    let list;
    if (isFromTenancies) {
      return [];
    }

    if (params && isOccupied) {
      list = [
        { label: t('property:editLeaseTerm'), value: MenuItems.EDIT_LEASE },
        { label: t('property:manageTenants'), value: MenuItems.MANAGE_TENANT },
      ];
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
    const { id, isSubleased, assetStatusInfo } = asset;
    const startDate = DateUtils.getUtcFormatted(assetStatusInfo?.leaseTransaction.leaseEndDate ?? '', 'DD/MM/YYYY');

    setAssetId(id);

    if (param && param.hasTakeAction) {
      navigation.navigate(ScreensKeys.AssetPlanSelection, {
        isFromPortfolio: true,
        isSubleased,
        leaseUnit: assetStatusInfo?.leaseUnitId ?? undefined,
        startDate: DateUtils.getFutureDateByUnit(startDate, 1, 'days'),
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
    this.clearStates();
  };

  private clearStates = (): void => {
    const { clearChatDetail, clearMessages, clearState } = this.props;
    clearChatDetail();
    clearMessages();
    clearState();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
    asset: AssetSelectors.getAsset(state),
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
  const { clearAsset, getAsset } = AssetActions;
  const { clearChatDetail, clearMessages, setCurrentChatDetail } = CommonActions;
  const { setCurrentOfferPayload, setCompareDetail, clearState } = OfferActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      setAssetId,
      setSelectedPlan,
      getAssetById,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
      clearAsset,
      clearChatDetail,
      clearMessages,
      setCurrentChatDetail,
      setCurrentOfferPayload,
      getAsset,
      setFilter,
      setCompareDetail,
      clearState,
    },
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
  background: {
    backgroundColor: theme.colors.white,
  },
  tabView: {
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
  },
  tabItem: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
});
