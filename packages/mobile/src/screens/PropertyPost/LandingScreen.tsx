import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Text, Label, Button } from '@homzhub/common/src/components';
import { SVGUri } from '@homzhub/mobile/src/components/atoms/Svg';
import { GradientBackground } from '@homzhub/mobile/src/screens/PropertyPost/GradientBackground';

interface IStateProps {
  user: IUser | null;
}

interface IDispatchProps {
  logoutSuccess: () => void;
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
              {t('propertyPost:welcomeUser', { username: user?.full_name ?? '' })}
            </Text>
            <Text type="small" textType="regular">
              {t('propertyPost:description')}
            </Text>
            <SVGUri width="90%" height="50%" uri="https://homzhub-bucket.s3.amazonaws.com/Group+1168.svg" />
            <Label type="regular" textType="regular">
              {t('propertyPost:searchProject')}
            </Label>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('propertyPost:addProperty')}
              type="primary"
              onPress={this.onAddProperty}
              containerStyle={styles.addProperty}
            />
            <Label type="large" textType="regular" style={styles.logoutContainer}>
              {t('propertyPost:logoutHelperText')} &nbsp;
              <Label type="large" textType="bold" style={styles.logout} onPress={this.logout}>
                {t('common:logout')}
              </Label>
            </Label>
            {/* TODO: to be removed once gmaps integration is present */}
            <Label type="small" textType="bold" style={styles.logout} onPress={this.navigateToPropertyDetails}>
              Property Details
            </Label>
          </View>
        </View>
      </GradientBackground>
    );
  }

  public onAddProperty = (): void => {
    const { navigation } = this.props;
    // TODO: Remove once add property screen is ready
    navigation.navigate(ScreensKeys.RentServicesScreen);
  };

  public logout = async (): Promise<void> => {
    const { logoutSuccess } = this.props;
    logoutSuccess();
    await StorageService.remove(StorageKeys.USER);
  };

  // TODO: to be removed once gmaps integration is present
  public navigateToPropertyDetails = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyDetailsScreen);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logoutSuccess } = UserActions;
  return bindActionCreators(
    {
      logoutSuccess,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LandingScreen));

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
    borderRadius: 8,
    margin: theme.layout.screenPadding,
    paddingHorizontal: theme.layout.screenPadding,
  },
  imagesContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
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
