import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Subscribed from '@homzhub/web/src/components/molecules/Subscribed';
import LimitedOfferForm from '@homzhub/web/src/screens/microSite/components/LimitedOfferForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IPopup {
  handlePopupClose: () => void;
}

const LimitedOfferPopUp = ({ handlePopupClose }: IPopup): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.microSite);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [didSubscribe, setDidSubscribe] = useState(false);
  useEffect(() => {
    let subscribedTimer: NodeJS.Timeout;
    if (didSubscribe) {
      subscribedTimer = setTimeout(() => {
        handlePopupClose();
      }, 2000);
    }
    return (): void => {
      clearTimeout(subscribedTimer);
    };
  }, [didSubscribe]);

  const handleUserSubscription = (): void => {
    setDidSubscribe(true);
  };

  const bannerImage = {
    height: isMobile ? 150 : 224,
    width: isMobile ? 244 : 346,
  };
  const navigateToNewScreen = (): void => {
    NavigationUtils.openNewTab({ path: 'https://rebrand.ly/homzhub-inspection-report' });
  };
  return (
    <>
      <Button
        icon={icons.close}
        iconSize={20}
        iconColor={theme.colors.darkTint3}
        onPress={handlePopupClose}
        containerStyle={styles.cross}
        type="text"
      />
      {didSubscribe ? (
        <Subscribed subText={t('limitedOfferThankYou')} />
      ) : (
        <View style={[styles.container, isMobile && styles.containerMobile]}>
          <View style={styles.alignToCenter}>
            <Image source={require('@homzhub/common/src/assets/images/limitedOffer.svg')} style={bannerImage} />
          </View>
          <View style={styles.alignToCenter}>
            <Typography
              variant={isMobile ? 'text' : 'title'}
              size="small"
              fontWeight="semiBold"
              style={styles.headerText}
            >
              {t('limitedPopupHeader')}
            </Typography>
            <Typography
              variant={isMobile ? 'label' : 'text'}
              size={isMobile ? 'regular' : 'small'}
              fontWeight="regular"
              style={styles.titleText}
            >
              <Trans t={t} i18nKey="limitedPopupTitle">
                Cities <strong>{{ city1: 'Pune' }}</strong> <strong>{{ city2: 'Nagpur' }}</strong>
              </Trans>
            </Typography>
            <LimitedOfferForm onUserSubscription={handleUserSubscription} />
            <View style={styles.noteTextContainer}>
              <Typography
                variant="label"
                size="large"
                fontWeight="regular"
                style={styles.noteTextBody}
                onPress={navigateToNewScreen}
              >
                {t('limitedPopupSubText')}
                <Typography
                  variant="label"
                  size="large"
                  fontWeight="regular"
                  style={styles.noteLinkText}
                  onPress={navigateToNewScreen}
                >
                  {t('limitedPopupSubTextLink')}
                </Typography>
              </Typography>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '90vh',
    backgroundColor: theme.colors.white,
    padding: 54,
    width: 'fitContent',
    overflowY: 'scroll',
    marginBottom: '5%',
  },
  alignToCenter: {
    alignItems: 'center',
  },
  containerMobile: {
    padding: 24,
  },
  image: {
    paddingHorizontal: 18,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 12,
  },
  titleText: {
    textAlign: 'center',
    marginTop: 12,
    width: '80%',
  },
  cross: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: 20,
    minHeight: 20,
    right: 24,
    top: 24,
  },
  noteTextContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  noteTextBody: {
    color: theme.colors.darkTint2,
  },
  noteLinkText: {
    color: theme.colors.darkTint2,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.darkTint2,
  },
});

export default LimitedOfferPopUp;
