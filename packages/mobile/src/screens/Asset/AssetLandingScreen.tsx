import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
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
import { images } from '@homzhub/common/src/assets/images';
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

export class AssetLandingScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, user } = this.props;
    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor={theme.colors.white} isTranslucent />
        <View style={styles.imagesContainer}>
          <Image source={images.landingScreenLogo} />
          <Text type="regular" textType="semiBold">
            {t('welcomeUser', { username: user?.fullName })}
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
        <Button
          title={t('addProperty')}
          type="primary"
          onPress={this.onAddProperty}
          containerStyle={styles.addProperty}
          testID="btnAddProperty"
        />
      </View>
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
    padding: 24,
  },
  imagesContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 0.9,
  },
  description: {
    textAlign: 'center',
  },
  addProperty: {
    flex: 0,
  },
});
