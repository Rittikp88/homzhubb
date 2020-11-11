import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { AnimatedProfileHeader, SearchBar } from '@homzhub/mobile/src/components';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps;

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

  // eslint-disable-next-line @typescript-eslint/require-await
  public onUpdateSearchText = async (value: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ searchText: value, limit: 50, offset: 0 }, async () => {
      await this.getAssetNotifications();
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

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Notifications);

const styles = StyleSheet.create({
  searchbar: {
    margin: theme.layout.screenPadding,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
});
