import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';
import { IRefreshTokenPayload, IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { Text, Label, Button, SVGUri } from '@homzhub/common/src/components';
import { GradientBackground } from '@homzhub/mobile/src/components/molecules/GradientBackground';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IStateProps {
  user: IUser | null;
}

interface IDispatchProps {
  logout: (data: IRefreshTokenPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyPostLandingScreen>;
type Props = IStateProps & IDispatchProps & libraryProps;

class LandingScreen extends React.PureComponent<Props, {}> {
  public render(): React.ReactNode {
    const { t, user } = this.props;
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.imagesContainer}>
            <Image source={images.landingScreenLogo} />
            <Text type="regular" textType="semiBold">
              {t('welcomeUser', { username: user?.full_name ?? '' })}
            </Text>
            <Text type="small" textType="regular" style={styles.description}>
              {t('description')}
            </Text>
            <SVGUri
              width={295}
              height={133}
              viewBox="0 0 295 133"
              preserveAspectRatio="xMidYMid meet"
              uri="https://homzhub-bucket.s3.amazonaws.com/Group+1168.svg"
            />
            <Label type="regular" textType="regular">
              {t('searchProject')}
            </Label>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('addProperty')}
              type="primary"
              onPress={this.onAddProperty}
              containerStyle={styles.addProperty}
            />
            <Label type="large" textType="regular" style={styles.logoutContainer}>
              {t('logoutHelperText')} &nbsp;
              <Label type="large" textType="bold" style={styles.logout} onPress={this.logout}>
                {t('common:logout')}
              </Label>
            </Label>
            <Label type="large" textType="bold" style={styles.logout} onPress={this.propertyVerification}>
              Property Verification
            </Label>
          </View>
        </View>
      </GradientBackground>
    );
  }

  public onAddProperty = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.SearchPropertyOwner);
  };

  public propertyVerification = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.ServiceCheckoutSteps);
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

const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
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
)(withTranslation(LocaleConstants.namespacesKey.property)(LandingScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    width: theme.viewport.width,
    maxHeight: theme.viewport.height - 100,
    borderRadius: 8,
    margin: theme.layout.screenPadding,
    paddingHorizontal: theme.layout.screenPadding,
  },
  imagesContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 0.9,
  },
  description: {
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  addProperty: {
    flex: 0,
  },
  logoutContainer: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  logout: {
    color: theme.colors.blue,
  },
});
