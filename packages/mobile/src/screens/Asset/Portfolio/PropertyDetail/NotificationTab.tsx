import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TopTabNavigatorParamList } from '@homzhub/mobile/src/navigation/TopTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { NotificationBox } from '@homzhub/common/src/components';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';

type libraryProps = NavigationScreenProps<TopTabNavigatorParamList, ScreensKeys.NotificationTab>;
type Props = WithTranslation & libraryProps;

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
    return (
      <NotificationBox
        data={notifications?.results ?? []}
        onPress={this.onNotificationClicked}
        isTitle={false}
        containerStyle={styles.notificationContainer}
      />
    );
  };

  public onNotificationClicked = (id: number): void => {};

  public getAssetNotifications = async (): Promise<void> => {
    const { limit, offset } = this.state;
    const response = await DashboardRepository.getAssetNotifications(limit, offset);
    this.setState({ notifications: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(NotificationTab);

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: theme.colors.white,
  },
});
