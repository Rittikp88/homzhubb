import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import {
  AssetNotifications,
  Notifications as NotificationModel,
} from '@homzhub/common/src/domain/models/AssetNotifications';
import { NotificationType } from '@homzhub/common/src/domain/models/DeeplinkMetaData';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DetailType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { NotificationScreens } from '@homzhub/mobile/src/services/constants';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setFilter: (payload: IFilter) => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
}

type libraryProps = NavigationScreenProps<CommonParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps & IDispatchProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  searchText: string;
  limit: number;
  offset: number;
  scrollEnabled: boolean;
}

export class Notifications extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: {} as AssetNotifications,
    searchText: '',
    limit: 50,
    offset: 0,
    scrollEnabled: true,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetNotifications();
  };

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    const { scrollEnabled } = this.state;
    const title = params && params.isFromDashboard ? t('dashboard') : t('assetMore:more');
    return (
      <UserScreen
        isOuterScrollEnabled={scrollEnabled}
        title={title}
        onBackPress={this.handleIconPress}
        pageTitle={t('notification')}
      >
        {this.renderNotifications()}
      </UserScreen>
    );
  }

  public renderNotifications = (): React.ReactElement => {
    const { t } = this.props;
    const { notifications, searchText } = this.state;
    let containerStyle = {
      height: 800,
    };
    if (notifications?.results && notifications?.results.length === 0) {
      containerStyle = {
        height: 200,
      };
    }
    return (
      <View style={[styles.searchBarContainer, containerStyle]}>
        <SearchBar
          placeholder={t('searchByKeyword')}
          value={searchText}
          updateValue={this.onUpdateSearchText}
          containerStyle={styles.searchbar}
        />
        {notifications?.results && notifications?.results.length === 0 && <EmptyState />}
        {notifications?.results && notifications?.results.length > 0 && (
          <NotificationBox
            data={notifications?.results}
            onPress={this.onNotificationClicked}
            unreadCount={notifications?.unreadCount ?? 0}
            shouldEnableOuterScroll={this.toggleScroll}
            onLoadMore={this.onLoadMore}
          />
        )}
      </View>
    );
  };

  // Todo : Refactor this.
  public onNotificationClicked = async (data: NotificationModel): Promise<void> => {
    const { notifications } = this.state;
    const { navigation, setFilter, setCurrentTicket, setCurrentOfferPayload, setCurrentAsset } = this.props;
    const {
      id,
      deeplinkMetadata: { objectId, type, assetId, leaseListingId, saleListingId, screen, leaseUnitId, messageGroupId },
      isRead,
    } = data;

    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      this.setState({ notifications: NotificationService.getUpdatedNotifications(id, notifications) });
    }

    if (type === NotificationType.SITE_VISIT) {
      navigation.navigate(ScreensKeys.PropertyVisits, { visitId: objectId });
    } else if (type === NotificationType.REVIEW_AND_RATING) {
      navigation.navigate(ScreensKeys.PropertyVisits, { reviewVisitId: objectId });
    } else if (type === NotificationType.PROPERTY_DETAIL || type === NotificationType.PROPERTY_PREVIEW) {
      setFilter({ asset_transaction_type: leaseListingId > 0 ? 0 : 1 });

      // @ts-ignore
      navigation.navigate(ScreensKeys.Search, {
        screen: ScreensKeys.PropertyAssetDescription,
        params: {
          propertyTermId: leaseListingId > 0 ? leaseListingId : saleListingId,
          propertyId: assetId,
        },
      });
    } else if (type === NotificationType.SERVICE_TICKET) {
      setCurrentTicket({ ticketId: objectId });
      navigation.navigate(ScreensKeys.ServiceTicketDetail);
    } else if (type === NotificationType.OFFER) {
      setCurrentOfferPayload({
        type: leaseListingId === -1 ? ListingType.SALE_LISTING : ListingType.LEASE_LISTING,
        listingId: leaseListingId === -1 ? saleListingId : leaseListingId,
        ...(Boolean(messageGroupId.length) && { threadId: messageGroupId }),
      });

      if (screen === NotificationScreens.OffersReceived) {
        // @ts-ignore
        navigation.navigate(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyOfferList,
            initial: false,
            params: { isReceivedFlow: true },
          },
        });
        return;
      }
      if (screen === NotificationScreens.OffersMade) {
        // @ts-ignore
        navigation.navigate(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyOfferList,
            initial: false,
            params: { isReceivedFlow: false },
          },
        });
        return;
      }

      if (screen === NotificationScreens.OfferChats) {
        navigation.navigate(ScreensKeys.ChatScreen, { isFromOffers: true });
        return;
      }
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.More,
        params: {
          screen: ScreensKeys.OfferDetail,
          initial: false,
        },
      });
    } else if (type === NotificationType.ASSET) {
      setCurrentAsset({
        asset_id: assetId,
        listing_id: leaseUnitId,
        assetType: DetailType.LEASE_UNIT,
      });
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.Portfolio,
        params: {
          screen: ScreensKeys.PropertyDetailScreen,
          initial: false,
        },
      });
    }
  };

  public onLoadMore = (): void => {
    const { notifications } = this.state;
    if (notifications.results && notifications.results.length !== notifications.count) {
      this.setState({ offset: notifications.results.length }, () => {
        this.getAssetNotifications().then();
      });
    }
  };

  public onUpdateSearchText = (value: string): void => {
    const { notifications } = this.state;
    const offset = value.length > 0 ? 0 : notifications.results.length;
    this.setState({ searchText: value, limit: 50, offset }, () => {
      this.getAssetNotifications().then();
    });
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public getAssetNotifications = async (): Promise<void> => {
    const { searchText, limit, offset, notifications } = this.state;
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    try {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      if (!searchText) {
        this.setState({
          notifications: NotificationService.transformNotificationsData(response, notifications),
        });
      } else {
        this.setState({
          notifications: response,
        });
      }
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentAsset } = PortfolioActions;
  const { setFilter } = SearchActions;
  const { setCurrentTicket } = TicketActions;
  const { setCurrentOfferPayload } = OfferActions;
  return bindActionCreators({ setCurrentAsset, setFilter, setCurrentTicket, setCurrentOfferPayload }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Notifications));

const styles = StyleSheet.create({
  searchbar: {
    margin: theme.layout.screenPadding,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
});
