import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { Text, NotificationBox } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, SearchBar } from '@homzhub/mobile/src/components';
import { AssetNotificationsData } from '@homzhub/common/src/mocks/AssetNotifications';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps;

interface IAssetNotificationsState {
  notifications: any[];
  searchText: string;
}

export class AssetNotifications extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: AssetNotificationsData,
    searchText: '',
  };

  // TODO: To be uncommented when the api is ready
  // public componentDidMount = async (): Promise<void> => {
  //   await this.getAssetNotifications();
  // };

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

  public renderNotifications = (): React.ReactElement => {
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
        <NotificationBox data={notifications} onPress={this.onNotificationClicked} />
      </View>
    );
  };

  public onNotificationClicked = (id: number): void => {};

  public onUpdateSearchText = (value: string): void => {
    this.setState({ searchText: value });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public getAssetNotifications = async (): Promise<void> => {
    const response = await DashboardRepository.getAssetNotifications();
    this.setState({ notifications: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetNotifications);

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
