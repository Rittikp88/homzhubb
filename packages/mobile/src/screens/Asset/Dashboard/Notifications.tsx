import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { AnimatedProfileHeader, SearchBar } from '@homzhub/mobile/src/components';
import {
  AssetNotifications,
  Notifications as NotificationModel,
} from '@homzhub/common/src/domain/models/AssetNotifications';
import { NotificationType } from '@homzhub/common/src/domain/models/DeeplinkMetaData';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { DetailType } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.AssetNotifications>;
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
      <AnimatedProfileHeader
        isOuterScrollEnabled={scrollEnabled}
        title={title}
        onBackPress={this.handleIconPress}
        sectionTitleType="semiBold"
        sectionHeader={t('notification')}
      >
        {this.renderNotifications()}
      </AnimatedProfileHeader>
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

  public onNotificationClicked = async (data: NotificationModel): Promise<void> => {
    const { notifications } = this.state;
    const {
      navigation,
      setCurrentAsset,
      route: { params },
    } = this.props;
    const {
      id,
      deeplinkMetadata: { objectId, type, assetId, leaseListingId, saleListingId },
      isRead,
    } = data;

    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      this.setState({ notifications: NotificationService.getUpdatedNotifications(id, notifications) });
    }

    if (type === NotificationType.SITE_VISIT) {
      navigation.navigate(ScreensKeys.PropertyVisits, { visitId: objectId });
    } else if (type === NotificationType.PROPERTY_DETAIL || type === NotificationType.PROPERTY_PREVIEW) {
      const payload: ISetAssetPayload = {
        asset_id: assetId,
        listing_id: leaseListingId > 0 ? leaseListingId : saleListingId,
        assetType: leaseListingId > 0 ? DetailType.LEASE_LISTING : DetailType.SALE_LISTING,
      };
      setCurrentAsset(payload);
      navigation.navigate(ScreensKeys.PropertyDetailScreen, {
        isFromDashboard: params && params.isFromDashboard ? params.isFromDashboard : false,
      });
    }
  };

  public onLoadMore = (): void => {
    const { limit, offset, notifications } = this.state;
    if (notifications.results && notifications.results.length !== notifications.count) {
      this.setState({ offset: offset + limit }, () => {
        this.getAssetNotifications().then();
      });
    }
  };

  public onUpdateSearchText = (value: string): void => {
    this.setState({ searchText: value, limit: 50, offset: 0 }, () => {
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
  return bindActionCreators({ setCurrentAsset }, dispatch);
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
