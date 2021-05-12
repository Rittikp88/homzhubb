import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { AssetNotifications, Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import InfiniteScrollView from '@homzhub/web/src/components/hoc/InfiniteScroll';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import NotificationHeader from '@homzhub/web/src/screens/notifications/components/NotificationHeader';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Notification: FC = () => {
  const [notifications, setNotifications] = useState({} as AssetNotifications);
  const [notificationsArray, setNotificationsArray] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const hasMore = !(notificationsArray?.length >= notifications.count);

  const getNotification = async (): Promise<void> => {
    const searchText = '';
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    try {
      setLoading(true);
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      setNotifications(response);
      setNotificationsArray((prevState: Notifications[]) =>
        prevState !== notificationsArray ? [...prevState, ...response.results] : [...prevState]
      );
      setOffset(offset + response.results.length);
      setLoading(false);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      setLoading(false);
    }
  };

  const getInitNotification = async (): Promise<void> => {
    const searchText = '';
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    try {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      setNotifications(response);
      setNotificationsArray((prevState: Notifications[]) =>
        prevState !== notificationsArray ? [...prevState, ...response.results] : [...prevState]
      );
      setOffset(response.results.length);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  useEffect(() => {
    if (!notificationsArray.length) {
      getInitNotification();
    }
  }, []);

  const onNotificationClicked = async (data: Notifications): Promise<void> => {
    const { id, isRead } = data;
    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      const index = notificationsArray.findIndex((el: Notifications) => el.id === id);
      const tempArray: Notifications[] = cloneDeep(notificationsArray);
      const updatedNotifications = notificationsArray[index];
      updatedNotifications.isRead = true;
      tempArray[index] = updatedNotifications;
      setNotificationsArray(tempArray);
      setNotifications(NotificationService.getUpdatedNotifications(id, notifications));
    }
  };

  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const isTab = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <NotificationHeader onMetricsClicked={FunctionUtils.noop} />
      <InfiniteScrollView
        data={notifications?.count}
        fetchMoreData={(): Promise<void> => getNotification()}
        height={isDesktop ? '600px' : '150vh'}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
        }}
        hasMore={hasMore}
        limit={limit}
        loader={loading}
      >
        <View style={styles.bodyContainer}>
          {notifications && notificationsArray.length > 0 && (
            <NotificationBox
              data={notificationsArray}
              onPress={onNotificationClicked}
              unreadCount={notifications?.unreadCount ?? 0}
              shouldEnableOuterScroll={FunctionUtils.noop}
              onLoadMore={FunctionUtils.noop}
              isTablet={isTab}
            />
          )}
        </View>
      </InfiniteScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
  },
});

export default Notification;
