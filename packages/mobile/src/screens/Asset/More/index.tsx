import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { MoreProfile } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { MORE_SCREENS, LOGOUT, IMoreScreenItem, MoreScreenTypes } from '@homzhub/common/src/constants/MoreScreens';

interface IDispatchProps {
  logout: () => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.MoreScreen>;
type Props = libraryProps & IDispatchProps;

export class More extends React.PureComponent<Props> {
  public render = (): React.ReactNode => {
    const { t } = this.props;
    const screenKeys: string[] = Object.keys(MORE_SCREENS);
    return (
      <UserScreen title={t('assetMore:more')}>
        <MoreProfile onIconPress={this.onIconPress} />
        {screenKeys.map(
          (section: string, sectionCount: number): React.ReactElement => {
            const currentData: IMoreScreenItem[] = MORE_SCREENS[section];
            return (
              <React.Fragment key={sectionCount}>
                {currentData.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {this.renderItem(item)}
                      {index !== currentData.length - 1 && this.renderSeparator()}
                    </React.Fragment>
                  );
                })}
                {sectionCount !== screenKeys.length - 1 && <Divider containerStyles={styles.listSeparator} />}
              </React.Fragment>
            );
          }
        )}
        {this.renderLogout()}
      </UserScreen>
    );
  };

  public renderItem = (item: IMoreScreenItem): React.ReactElement => {
    const { t } = this.props;
    const onPress = (): void => {
      this.handleNavigation(item.type, t(item.title));
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
    const { logout } = this.props;
    return (
      <>
        {this.renderLogoutSeparator()}
        <TouchableOpacity onPress={logout} style={styles.logout} testID="touchLogout">
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

  public onIconPress = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.UserProfileScreen);
  };

  public handleNavigation = (type: MoreScreenTypes, title: string): void => {
    const { navigation, t } = this.props;
    switch (type) {
      case MoreScreenTypes.NOTIFICATIONS:
        navigation.navigate(ScreensKeys.AssetNotifications);
        break;
      case MoreScreenTypes.MARKET_TRENDS:
        // @ts-ignore
        navigation.navigate(ScreensKeys.MarketTrends);
        break;
      case MoreScreenTypes.PROPERTY_VISITS:
        navigation.navigate(ScreensKeys.PropertyVisits);
        break;
      case MoreScreenTypes.SETTINGS:
        navigation.navigate(ScreensKeys.SettingsScreen);
        break;
      case MoreScreenTypes.SUPPORT:
        navigation.navigate(ScreensKeys.SupportScreen);
        break;
      case MoreScreenTypes.REFER_FRIEND:
        navigation.navigate(ScreensKeys.ReferEarn);
        break;
      case MoreScreenTypes.SAVED_PROPERTIES:
        navigation.navigate(ScreensKeys.SavedPropertiesScreen);
        break;
      case MoreScreenTypes.KYC_DOCUMENTS:
        navigation.navigate(ScreensKeys.KYC);
        break;
      case MoreScreenTypes.VALUE_ADDED_SERVICES:
        navigation.navigate(ScreensKeys.ValueAddedServices);
        break;
      default:
        navigation.navigate(ScreensKeys.ComingSoonScreen, { title, tabHeader: t('assetMore:more') });
        break;
    }
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
