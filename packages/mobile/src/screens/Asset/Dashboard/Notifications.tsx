import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { Text, NotificationBox, EmptyState } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, SearchBar } from '@homzhub/mobile/src/components';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  searchText: string;
  limit: number;
  offset: number;
}

export class Notifications extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: {} as AssetNotifications,
    searchText: '',
    limit: 50,
    offset: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetNotifications();
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderHeader()}
          {this.renderNotifications()}
        </>
      </AnimatedProfileHeader>
    );
  };

  public renderHeader = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.header}>
        <Icon
          name={icons.leftArrow}
          size={20}
          color={theme.colors.primaryColor}
          onPress={this.handleIconPress}
          testID="icnBack"
        />
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('notification')}
        </Text>
      </View>
    );
  };

  public renderNotifications = (): React.ReactNode => {
    const { t } = this.props;
    const { notifications, searchText } = this.state;
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder={t('searchByKeyword')}
          value={searchText}
          updateValue={this.onUpdateSearchText}
          containerStyle={styles.searchbar}
        />
        {notifications?.results && notifications?.results.length === 0 && <EmptyState />}
        {notifications?.results && notifications?.results.length > 0 && (
          <NotificationBox
            data={notifications?.results ?? []}
            onPress={this.onNotificationClicked}
            unreadCount={notifications?.unreadCount ?? 0}
            onLoadMore={this.onLoadMore}
          />
        )}
      </View>
    );
  };

  public onNotificationClicked = async (id: number): Promise<void> => {
    await DashboardRepository.updateNotificationStatus(id);
    await this.getAssetNotifications();
  };

  public onLoadMore = (): void => {
    // TODO: Call the getAssetNotifications with more offset once the scroll issue is solved
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  public onUpdateSearchText = async (value: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.setState({ searchText: value }, async () => {
      await this.getAssetNotifications();
    });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public getAssetNotifications = async (): Promise<void> => {
    const { searchText, limit, offset } = this.state;
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    const response = await DashboardRepository.getAssetNotifications(requestPayload);
    this.setState({ notifications: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Notifications);

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 4,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    color: theme.colors.darkTint1,
    marginLeft: 12,
  },
  searchbar: {
    margin: theme.layout.screenPadding,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
});
