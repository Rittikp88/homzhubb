import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { AssetNotifications, Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { AssetStatusInfo } from '@homzhub/common/src/domain/models/AssetStatusInfo';
import { INotificationsPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  assetStatusInfo: AssetStatusInfo | null;
  propertyId: number;
  isManagedProperty?: boolean;
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
    const { t } = this.props;

    return (
      <View style={[styles.notificationContainer, notifications?.count > 10 && styles.heightStyle]}>
        <TextWithIcon
          text={t('assetDashboard:notification')}
          icon={icons.alert}
          iconColor={theme.colors.darkTint3}
          containerStyle={styles.heading}
          subContainerStyle={styles.subHeading}
        />
        {isEmpty(notifications) || notifications.count === 0 ? (
          <EmptyState />
        ) : (
          <NotificationBox
            data={notifications?.results ?? []}
            onPress={this.onNotificationClicked}
            isTitle={false}
            unreadCount={notifications?.unreadCount ?? 0}
            onLoadMore={this.onLoadMore}
          />
        )}
      </View>
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
    const { assetStatusInfo, propertyId } = this.props;
    const { limit, offset, notifications } = this.state;
    if (!assetStatusInfo) return;
    const { saleListingId, leaseListingId, leaseTransaction } = assetStatusInfo;
    const isTransaction = leaseTransaction && leaseTransaction.id > 0;
    const isAsset = !isTransaction && !leaseListingId && !saleListingId;

    let requestPayload: INotificationsPayload = {
      limit,
      offset,
    };
    if (isTransaction) {
      requestPayload = { ...requestPayload, lease_transaction_id: leaseTransaction.id };
    }

    if (!isTransaction && leaseListingId) {
      requestPayload = { ...requestPayload, lease_listing_id: leaseListingId };
    }

    if (!isTransaction && saleListingId) {
      requestPayload = { ...requestPayload, sale_listing_id: saleListingId };
    }

    if (isAsset) {
      requestPayload = { ...requestPayload, asset_id: propertyId };
    }

    try {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      this.setState({
        notifications: NotificationService.transformNotificationsData(response, notifications),
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(NotificationTab);

const styles = StyleSheet.create({
  notificationContainer: {
    marginVertical: 16,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
  },
  heightStyle: {
    height: theme.viewport.height,
  },
  heading: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    marginHorizontal: 16,
  },
  subHeading: {
    marginHorizontal: 12,
  },
});
