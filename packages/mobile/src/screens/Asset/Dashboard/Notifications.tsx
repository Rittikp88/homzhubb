import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { Text, NotificationBox, EmptyState } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, SearchBar } from '@homzhub/mobile/src/components';
import { AssetNotifications, IAssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  searchText: string;
  limit: number;
  offset: number;
  shouldLoadMore: boolean;
}

export class Notifications extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: {} as AssetNotifications,
    searchText: '',
    limit: 50,
    offset: 0,
    shouldLoadMore: true,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetNotifications();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderHeader()}
          {this.renderNotifications()}
        </>
      </AnimatedProfileHeader>
    );
  }

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
    let containerStyle = {
      height: 500,
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
    const { limit, offset, shouldLoadMore } = this.state;
    if (shouldLoadMore) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.setState({ offset: limit + offset }, async () => {
        await this.getAssetNotifications();
      });
    }
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
    const { searchText, limit, offset, notifications } = this.state;
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    const response = await DashboardRepository.getAssetNotifications(requestPayload);
    if (!searchText) {
      const serializedNewResponse: IAssetNotifications = ObjectMapper.serialize(response);
      const serializedOldResponse: IAssetNotifications = ObjectMapper.serialize(notifications);
      const updatedNotifications = {
        ...serializedNewResponse,
        results:
          serializedOldResponse.results && serializedOldResponse.results.length > 0
            ? serializedOldResponse.results.concat(serializedNewResponse.results)
            : serializedNewResponse.results,
      };
      this.setState({
        notifications: ObjectMapper.deserialize(AssetNotifications, updatedNotifications),
        shouldLoadMore: !(serializedNewResponse.results.length === 0),
      });
    } else {
      this.setState({
        notifications: response,
        shouldLoadMore: !(response.results.length === 0),
      });
    }
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
