import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialAuthUtils } from '@homzhub/common/src/utils/SocialAuthUtils';
import { AuthService } from '@homzhub/mobile/src/services/AuthService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import Google from '@homzhub/common/src/assets/images/google.svg';
import Facebook from '@homzhub/common/src/assets/images/facebook.svg';
import LinkedIn from '@homzhub/common/src/assets/images/linkedin.svg';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import CommonAuthenticationHoc from '@homzhub/common/src/components/organisms/CommonAuthenticationHOC';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { ISocialUserData, SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  loginSuccess: (data: IUserTokens) => void;
}

interface IAuthenticationGatewayProps {
  isFromLogin: boolean;
  onEmailLogin?: () => void;
  testID?: string;
  navigation: StackNavigationProp<AuthStackParamList, ScreensKeys.SignUp | ScreensKeys.Login>;
  toggleLoading?: (isLoading: boolean) => void;
}

type Props = IAuthenticationGatewayProps & WithTranslation & IDispatchProps;

interface IOwnState {
  authProviders: SocialAuthProvider[];
}

class AuthenticationGateways extends React.PureComponent<Props, IOwnState> {
  public state = {
    authProviders: [],
  };

  public componentDidMount(): void {
    SocialAuthUtils.fetchSocialMedia((response) => {
      this.setState({ authProviders: response });
    });
  }

  public render(): React.ReactNode {
    const { onEmailLogin, isFromLogin } = this.props;

    return (
      <CommonAuthenticationHoc isFromLogin={isFromLogin} onEmailLogin={onEmailLogin}>
        {this.renderSocialAuths()}
      </CommonAuthenticationHoc>
    );
  }

  private renderSocialAuths = (): React.ReactNode => {
    const { authProviders } = this.state;

    return authProviders.map((auth: SocialAuthProvider) => {
      const initiateSocialLogin = async (): Promise<void> => {
        await this.initiateSocialAuthentication(auth.provider);
      };

      return (
        <>
          {auth.visible && (
            <TouchableOpacity style={styles.alignToCenter} onPress={initiateSocialLogin} key={auth.provider}>
              {this.getImageUrlForLib(auth.provider)}
              <Label type="regular" textType="regular" style={styles.iconTextStyle}>
                {auth.description}
              </Label>
            </TouchableOpacity>
          )}
        </>
      );
    });
  };

  private onSocialAuthSuccess = async (userData: ISocialUserData): Promise<void> => {
    const { loginSuccess, navigation, isFromLogin } = this.props;

    await SocialAuthUtils.onSocialAuthSuccess(
      userData,
      () => {
        navigation.navigate(ScreensKeys.MobileVerification, {
          isFromLogin,
          userData,
        });
      },
      (response) => {
        loginSuccess(response);
      }
    );
  };

  private initiateSocialAuthentication = async (key: string): Promise<void> => {
    const { isFromLogin, navigation } = this.props;
    this.setLoading(true);
    if (key === SocialAuthKeys.Google) {
      await AuthService.signInWithGoogle(this.onSocialAuthSuccess);
      this.setLoading(false);
      return;
    }

    if (key === SocialAuthKeys.Facebook) {
      await AuthService.signInWithFacebook(this.onSocialAuthSuccess, isFromLogin && navigation);
      this.setLoading(false);
    }
  };

  private setLoading = (isLoading: boolean): void => {
    const { toggleLoading } = this.props;
    if (toggleLoading) {
      toggleLoading(isLoading);
    }
  };

  private getImageUrlForLib = (key: string): React.ReactNode => {
    switch (key) {
      case SocialAuthKeys.Facebook:
        return <Facebook />;
      case SocialAuthKeys.Google:
        return <Google />;
      case SocialAuthKeys.LinkedIn:
        return <LinkedIn />;
      default:
        return null;
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { loginSuccess } = UserActions;
  return bindActionCreators(
    {
      loginSuccess,
    },
    dispatch
  );
};

const HOC = connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.auth)(AuthenticationGateways));
export { HOC as AuthenticationGateways };

const styles = StyleSheet.create({
  iconTextStyle: {
    marginTop: 4,
  },
  alignToCenter: {
    alignItems: 'center',
  },
});
