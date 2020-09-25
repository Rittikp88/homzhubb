import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IRefreshTokenPayload, IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { BottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Text } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, MoreProfile } from '@homzhub/mobile/src/components';
import { MORE_SCREENS, LOGOUT, IMoreScreenItem, MoreScreenTypes } from '@homzhub/common/src/constants/MoreScreens';

interface IDispatchProps {
  logout: (data: IRefreshTokenPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<BottomTabNavigatorParamList, ScreensKeys.More>;
type Props = libraryProps & IDispatchProps;

export class More extends React.PureComponent<Props> {
  public render = (): React.ReactNode => {
    const { t } = this.props;
    const screenKeys: string[] = Object.keys(MORE_SCREENS);
    return (
      <AnimatedProfileHeader title={t('assetMore:more')}>
        <View style={styles.moreStack}>
          <MoreProfile onIconPress={this.onIconPress} />
          {screenKeys.map(
            (section: string, index: number): React.ReactElement => {
              const currentData: IMoreScreenItem[] = MORE_SCREENS[section];
              const lastIndex = index === screenKeys.length - 1;
              return (
                <View key={index}>
                  <FlatList
                    data={currentData}
                    renderItem={this.renderItem}
                    keyExtractor={this.renderKeyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                    key={index}
                    testID="moreList"
                  />
                  {!lastIndex && <Divider containerStyles={styles.listSeparator} />}
                </View>
              );
            }
          )}
          {this.renderLogout()}
        </View>
      </AnimatedProfileHeader>
    );
  };

  private renderKeyExtractor = (item: IMoreScreenItem, index: number): string => index.toString();

  public renderItem = ({ item }: { item: IMoreScreenItem }): React.ReactElement => {
    const onPress = (): void => {
      this.handleNavigation(item.type);
    };
    return <TouchableOpacity onPress={onPress}>{this.renderItemWithIcon(item, false)}</TouchableOpacity>;
  };

  public renderItemWithIcon = (item: IMoreScreenItem, isLogout: boolean): React.ReactElement => {
    const { t } = this.props;
    return (
      <View key={`item-${item.id}`} style={styles.moreItem}>
        <View style={styles.iconAndText}>
          <Icon name={item.icon} size={22} color={item.iconColor} style={styles.iconPosition} />
          <Text
            type="small"
            textType={isLogout ? 'semiBold' : 'regular'}
            style={[styles.itemText, { color: item.textColor }]}
            minimumFontScale={0.1}
            numberOfLines={2}
            allowFontScaling
          >
            {t(item.title)}
          </Text>
        </View>
        {!isLogout && <Icon name={icons.rightArrow} size={18} color={item.iconColor} />}
      </View>
    );
  };

  public renderLogout = (): React.ReactElement => {
    return (
      <>
        {this.renderLogoutSeparator()}
        <TouchableOpacity onPress={this.logout} style={styles.logout} testID="touchLogout">
          {this.renderItemWithIcon(LOGOUT, true)}
        </TouchableOpacity>
      </>
    );
  };

  public renderSeparator = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  public renderLogoutSeparator = (): React.ReactElement => {
    return <Divider containerStyles={styles.logoutSeparator} />;
  };

  public onIconPress = (): void => {};

  public handleNavigation = (type: MoreScreenTypes): void => {
    const { navigation } = this.props;
    switch (type) {
      case MoreScreenTypes.NOTIFICATIONS:
        navigation.dispatch(
          CommonActions.navigate({
            name: ScreensKeys.AssetNotifications,
          })
        );
        break;
      case MoreScreenTypes.MARKET_TRENDS:
        navigation.dispatch(
          CommonActions.navigate({
            name: ScreensKeys.MarketTrends,
          })
        );
        break;
      default:
        navigation.dispatch(
          CommonActions.navigate({
            name: ScreensKeys.More,
          })
        );
        break;
    }
  };

  public logout = async (): Promise<void> => {
    const { logout } = this.props;
    const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
    if (!user) {
      return;
    }
    const { refresh_token } = user;
    const logoutPayload = {
      refresh_token,
    };
    logout(logoutPayload);
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logout } = UserActions;
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(withTranslation()(More));

const styles = StyleSheet.create({
  moreStack: {
    backgroundColor: theme.colors.white,
  },
  moreItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  itemText: {
    marginStart: 10,
  },
  logout: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    borderColor: theme.colors.unreadNotification,
    borderWidth: 1,
    marginLeft: 65,
  },
  logoutSeparator: {
    borderColor: theme.colors.unreadNotification,
    borderWidth: 1.5,
  },
  iconAndText: {
    flexDirection: 'row',
  },
  iconPosition: {
    paddingHorizontal: 5,
  },
  listSeparator: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
  },
});
