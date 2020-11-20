import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { AssetNotifications, Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { AssetStatusInfo } from '@homzhub/common/src/domain/models/AssetStatusInfo';

interface IProps {
  assetStatusInfo: AssetStatusInfo | null;
}

type Props = WithTranslation & IProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  limit: number;
  offset: number;
}

export class NotificationTab extends React.Component<Props, IAssetNotificationsState> {
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

  public onNotificationClicked = async (data: Notifications): Promise<void> => {
    const { notifications } = this.state;
    const { id, isRead } = data;
    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      this.setState({ notifications: NotificationService.getUpdatedNotifications(id, notifications) });
    }
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
    const { assetStatusInfo } = this.props;
    const { limit, offset, notifications } = this.state;

    const requestPayload = {
      limit,
      offset,
      ...(assetStatusInfo?.saleListingId ? { sale_listing_id: assetStatusInfo?.saleListingId } : {}),
      ...(assetStatusInfo?.leaseListingId ? { lease_listing_id: assetStatusInfo?.leaseListingId } : {}),
    };
    if (requestPayload.sale_listing_id || requestPayload.lease_listing_id) {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      this.setState({
        notifications: NotificationService.transformNotificationsData(response, notifications),
      });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(NotificationTab);

const styles = StyleSheet.create({
  notificationContainer: {
    flex: 0,
    backgroundColor: theme.colors.white,
  },
});
