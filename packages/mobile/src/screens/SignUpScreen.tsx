import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { SignupView, Button, Header } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

// Constant Height for Animated header
const HEADER_MAX_HEIGHT = PlatformUtils.isIOS() ? 200 : 180;
const HEADER_MIN_HEIGHT = PlatformUtils.isIOS() ? 100 : 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface IDispatchProps {
  getSocialMedia: () => void;
}

interface IStateProps {
  user: IUserState;
}

interface ISignUpState {
  animatedValue: Animated.Value;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IStateProps & IDispatchProps & libraryProps;

class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    animatedValue: new Animated.Value(0),
  };

  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactNode {
    const { animatedValue } = this.state;
    const { user, t } = this.props;
    const headerHeight = this.getAnimatedHeaderStyle();
    const animatedStyle = this.getAnimatedStyles();

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }])}
        >
          <View style={styles.scrollViewContent}>
            <SignupView socialMediaItems={user.data} />
            <Button type="primary" title="OTP" onPress={this.onPress} />
          </View>
        </ScrollView>
        <Animated.View style={[styles.headerView, { height: headerHeight }]}>
          <Header
            icon="close"
            title={t('signUp')}
            subTitle={t('auth:alreadyRegistered')}
            linkText={t('login')}
            onIconPress={this.onClosePress}
            animatedStyle={animatedStyle}
            headerContainerStyle={styles.headerStyle}
          />
        </Animated.View>
      </View>
    );
  }

  private onPress = (): void => {
    const { navigation } = this.props;
    // TODO: Take value from form
    navigation.navigate(ScreensKeys.OTP, {
      phone: '+91 9008004265',
    });
  };

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private getAnimatedHeaderStyle = (): Animated.AnimatedInterpolation => {
    const { animatedValue } = this.state;
    return animatedValue.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
  };

  private getAnimatedStyles = (): Animated.AnimatedWithChildren => {
    const { animatedValue } = this.state;
    return {
      fontSize: animatedValue.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [24, 16],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 150],
            extrapolate: 'clamp',
          }),
        },
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  };
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  headerView: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  headerStyle: {
    flex: 1,
    marginTop: PlatformUtils.isIOS() ? 50 : 20,
  },
});
