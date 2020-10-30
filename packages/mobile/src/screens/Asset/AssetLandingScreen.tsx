import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';
import { IRefreshTokenPayload, IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Logo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { Text, Label, Button, SVGUri } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { User } from '@homzhub/common/src/domain/models/User';

interface IStateProps {
  user: User | null;
}

interface IDispatchProps {
  logout: (data: IRefreshTokenPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyPostLandingScreen>;
type Props = IStateProps & IDispatchProps & libraryProps;
const IMAGE = 'https://homzhub-bucket.s3.amazonaws.com/Group+1168.svg';

export class AssetLandingScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, user } = this.props;
    return (
      <>
        <StatusBarComponent backgroundColor={theme.colors.white} isTranslucent />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Logo width={60} height={60} style={styles.logo} />
            <Text type="large" textType="semiBold" style={styles.title}>
              {t('welcomeUser', { username: user?.fullName })}
            </Text>
            <Text type="regular" textType="regular" style={styles.description}>
              {t('description')}
            </Text>
            <View style={styles.imageContainer}>
              <SVGUri preserveAspectRatio="xMidYMid meet" uri={IMAGE} />
            </View>
            <Label type="large" textType="regular" style={styles.label}>
              {t('searchProject')}
            </Label>
            <Button
              title={t('addProperty')}
              type="primary"
              onPress={this.onAddProperty}
              containerStyle={styles.addProperty}
              testID="btnAddProperty"
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  public onAddProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
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

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logout } = UserActions;
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLandingScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 296,
    height: 132,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginTop: 28,
    marginBottom: 36,
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  label: {
    marginTop: 44,
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  addProperty: {
    flex: 0,
    marginTop: 16,
  },
});
