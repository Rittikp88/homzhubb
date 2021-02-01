import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const OurServicesSection: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const navigateToPrivacyPolicyScreen = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.publicRoutes.PRIVACY_POLICY });
  };
  const navigateToTermsAndConditionScreen = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.publicRoutes.TERMS_CONDITION });
  };
  return (
    <View style={styles.container}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View>
          <Typography
            variant="label"
            size="large"
            fontWeight="semiBold"
            style={[styles.text, isMobile && styles.textMobile]}
          >
            {t('landing:ourServices')}
          </Typography>
          <View style={[styles.linksRow, isMobile && styles.linksRowMobile]}>
            <Button
              type="text"
              title={t('moreSettings:termsConditionsText')}
              textType="label"
              textSize="large"
              fontType="regular"
              titleStyle={[styles.text, isMobile && styles.textMobile]}
              onPress={navigateToTermsAndConditionScreen}
            />
            <Button
              type="text"
              containerStyle={styles.privacyPolicy}
              title={t('moreSettings:privacyPolicyText')}
              textType="label"
              textSize="large"
              fontType="regular"
              titleStyle={[styles.text, isMobile && styles.textMobile]}
              onPress={navigateToPrivacyPolicyScreen}
            />
          </View>
        </View>
        <Newsletter />
      </View>
    </View>
  );
};

const Newsletter = (): React.ReactElement => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [didSubscribe, setDidSubscribe] = useState(false);
  const [email, setEmail] = useState('');
  useEffect(() => {
    let subscribedTimer: NodeJS.Timeout;
    if (didSubscribe) {
      subscribedTimer = setTimeout(() => {
        setDidSubscribe(false);
      }, 2000);
    }
    return (): void => {
      clearTimeout(subscribedTimer);
    };
  }, [didSubscribe]);
  const subscribeToNewsLetter = async (): Promise<void> => {
    await CommonRepository.subscribeToNewsLetter({ email })
      .then(() => {
        setDidSubscribe(true);
        setEmail('');
      })
      .catch((error) => {
        AlertHelper.error({ message: error.message });
      });
  };
  return (
    <View style={[styles.newsletterContainer, isMobile && styles.newsletterContainerMobile]}>
      <Typography variant="label" size="large" fontWeight="regular" style={styles.text}>
        {t('landing:subscribeEmailDesc')}
      </Typography>
      <View style={[styles.emailInputBox, isMobile && styles.emailInputBoxMobile]}>
        <TextInput
          placeholder={t('landing:enterEmail')}
          placeholderTextColor={theme.colors.darkTint10}
          style={[styles.emailInput, isMobile && styles.emailInputMobile]}
          value={email}
          onChangeText={setEmail}
        />
        <Button
          type="secondary"
          containerStyle={[styles.subscribeBtn, isMobile && styles.subscribeBtnMobile]}
          title={didSubscribe ? t('landing:subscribed') : t('landing:subscribe')}
          textType="label"
          textSize="large"
          fontType="regular"
          titleStyle={styles.subscribeBtnTxt}
          onPress={subscribeToNewsLetter}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 243,
    backgroundColor: theme.colors.blue,
  },
  content: {
    width: theme.layout.dashboardWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentMobile: {
    width: theme.layout.dashboardMobileWidth,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyPolicy: {
    marginLeft: 36,
  },
  text: {
    textAlign: 'left',
    color: theme.colors.white,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  textMobile: {
    textAlign: 'center',
  },
  emailInput: {
    color: theme.colors.white,
    padding: 12,
    width: 'fit-content',
  },
  emailInputMobile: {
    width: '100%',
  },
  emailInputBox: {
    borderRadius: 4,
    marginTop: 12,
    width: 'fit-content',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: theme.colors.darkGrayishBlue,
  },
  emailInputBoxMobile: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 30,
  },
  subscribeBtnTxt: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  subscribeBtnMobile: {
    margin: 4,
  },
  subscribeBtn: {
    margin: 6,
  },
  newsletterContainer: {
    alignItems: undefined,
  },
  newsletterContainerMobile: {
    marginTop: 36,
    alignItems: 'center',
  },
  linksRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: undefined,
  },
  linksRowMobile: {
    justifyContent: 'center',
  },
});

export default OurServicesSection;
