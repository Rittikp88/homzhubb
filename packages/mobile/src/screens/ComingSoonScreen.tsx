import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DashboardNavigatorParamList, MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type paramsList = DashboardNavigatorParamList | MoreStackNavigatorParamList;
type libraryProps = NavigationScreenProps<paramsList, ScreensKeys.ComingSoonScreen>;

type Props = WithTranslation & libraryProps;

class ComingSoonScreen extends React.PureComponent<Props> {
  public render = (): React.ReactElement => {
    const {
      t,
      route: {
        params: { title, tabHeader },
      },
    } = this.props;

    return (
      <UserScreen title={tabHeader} pageTitle={title} onBackPress={this.goBack}>
        <View style={styles.screen}>
          <Text type="large" textType="semiBold">
            {t('comingSoonText')}
          </Text>
        </View>
      </UserScreen>
    );
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.common)(ComingSoonScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingTop: theme.viewport.height / 3,
    paddingBottom: theme.viewport.height / 3,
  },
});
