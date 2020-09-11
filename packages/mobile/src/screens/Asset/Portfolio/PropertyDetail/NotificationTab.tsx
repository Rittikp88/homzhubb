import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TopTabNavigatorParamList } from '@homzhub/mobile/src/navigation/TopTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState, NotificationBox } from '@homzhub/common/src/components';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IStateProps {
  propertyData: Asset | null;
}

type libraryProps = NavigationScreenProps<TopTabNavigatorParamList, ScreensKeys.NotificationTab>;
type Props = WithTranslation & libraryProps & IStateProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  limit: number;
  offset: number;
}

export class NotificationTab extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: {} as AssetNotifications,
    limit: 10,
    offset: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetNotifications();
  };

  public render = (): React.ReactNode => {
    const { notifications } = this.state;
    if (isEmpty(notifications) || notifications.count === 0) {
      return <EmptyState />;
    }
    return (
      <NotificationBox
        data={notifications?.results ?? []}
        onPress={this.onNotificationClicked}
        isTitle={false}
        unreadCount={notifications?.unreadCount ?? 0}
        containerStyle={styles.notificationContainer}
        onLoadMore={this.onLoadMore}
      />
    );
  };

  public onNotificationClicked = async (id: number): Promise<void> => {
    const { notifications } = this.state;
    await DashboardRepository.updateNotificationStatus(id);
    this.setState({ notifications: NotificationService.getUpdatedNotifications(id, notifications) });
  };

  public onLoadMore = (): void => {
    const { limit, offset, notifications } = this.state;
    if (notifications.results && notifications.results.length !== notifications.count) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.setState({ offset: offset + limit }, async () => {
        await this.getAssetNotifications();
      });
    }
  };

  public getAssetNotifications = async (): Promise<void> => {
    const { propertyData } = this.props;
    const { limit, offset, notifications } = this.state;
    const requestPayload = {
      limit,
      offset,
      ...(propertyData?.assetStatusInfo.saleListingId
        ? { sale_listing_id: propertyData?.assetStatusInfo?.saleListingId }
        : {}),
      ...(propertyData?.assetStatusInfo.leaseListingId
        ? { lease_listing_id: propertyData?.assetStatusInfo?.leaseListingId }
        : {}),
    };
    if (requestPayload.sale_listing_id || requestPayload.lease_listing_id) {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      this.setState({
        notifications: NotificationService.transformNotificationsData(response, notifications),
      });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    propertyData: PortfolioSelectors.getAssetById(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(NotificationTab));

const styles = StyleSheet.create({
  notificationContainer: {
    flex: 0,
    backgroundColor: theme.colors.white,
  },
});
