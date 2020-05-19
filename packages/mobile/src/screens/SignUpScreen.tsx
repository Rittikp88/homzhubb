import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { SignupView, Button } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  getSocialMedia: () => void;
}

interface IStateProps {
  user: IUserState;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IStateProps & IDispatchProps & libraryProps;

class SignUpScreen extends React.PureComponent<Props, {}> {
  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactElement {
    const { user } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <SignupView socialMediaItems={user.data} />
          <Button type="primary" title="OTP" onPress={this.onPress} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  private onPress = (): void => {
    const { navigation } = this.props;
    // TODO: Take value from form
    navigation.navigate(ScreensKeys.OTP, {
      phone: '+91 9008004265',
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const { user } = state;
  return {
    user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getSocialMedia } = UserActions;
  return bindActionCreators(
    {
      getSocialMedia,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SignUpScreen));
