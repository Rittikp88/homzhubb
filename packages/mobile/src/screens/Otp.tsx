import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label, Text, OtpTimer, OtpInputs, Header } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type IProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OTP> & WithTranslation;
class Otp extends React.PureComponent<IProps> {
  public componentDidMount(): void {
    // TODO: Add API call logic for fetch OTP here
  }

  public render = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const title = params?.title ?? t('verifyNumber');
    const phone = params?.phone ?? '';

    return (
      <SafeAreaView style={styles.screen}>
        <Header icon="left-arrow" onIconPress={this.onIconPress} headerContainerStyle={styles.headerStyle} />
        <View style={styles.container}>
          <Text type="large" textType="semiBold">
            {title}
          </Text>
          <Label style={styles.subTitle} type="large" textType="regular">
            {t('enterOTP')}
          </Label>
          <View style={styles.numberContainer}>
            <Text type="small" textType="semiBold">
              {phone}
            </Text>
            <Icon
              name="note-book"
              size={16}
              color={theme.colors.active}
              style={styles.icon}
              onPress={this.onIconPress}
            />
          </View>
          <OtpInputs bubbleOtp={this.getOtp} />
          <OtpTimer onResentPress={this.onResendPress} />
        </View>
      </SafeAreaView>
    );
  };

  private onIconPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;

    if (params && params.focusCallback) {
      params.focusCallback();
    }

    navigation.goBack();
  };

  private onResendPress = (): void => {
    // TODO: Add API call logic for fetch OTP here
    console.log('press');
  };

  private getOtp = (otp: string): void => {
    // TODO: Add API call logic for verify OTP here
    console.log(otp);
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.auth)(Otp);
export { HOC as Otp };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    marginTop: theme.layout.screenPaddingTop,
    marginHorizontal: theme.layout.screenPadding,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitle: {
    marginVertical: 8,
    color: theme.colors.darkTint3,
  },
  icon: {
    marginStart: 8,
  },
  headerStyle: {
    marginTop: 0,
  },
});
