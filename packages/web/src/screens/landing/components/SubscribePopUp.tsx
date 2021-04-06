import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import Subscribe from '@homzhub/common/src/assets/images/subscribe.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Subscribed from '@homzhub/web/src/screens/landing/components/Subscribed';
import SubscribeForm from '@homzhub/web/src/screens/landing/components/SubscribeForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IPopup {
  handlePopupClose: () => void;
}

const SubscribePopUp = ({ handlePopupClose }: IPopup): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
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

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <Button
        icon={icons.close}
        iconSize={20}
        iconColor={theme.colors.darkTint3}
        onPress={handlePopupClose}
        containerStyle={styles.cross}
        type="text"
      />
      {didSubscribe ? (
        <Subscribed />
      ) : (
        <>
          <View style={styles.alignToCenter}>
            <Subscribe width={isMobile ? '100%' : undefined} />
          </View>
          <View style={styles.alignToCenter}>
            <Typography
              variant={isMobile ? 'text' : 'title'}
              size="small"
              fontWeight="semiBold"
              style={styles.headerText}
            >
              {t('subscribePopupHeader')}
            </Typography>
            <Typography
              variant={isMobile ? 'label' : 'text'}
              size={isMobile ? 'regular' : 'small'}
              fontWeight="regular"
              style={styles.titleText}
            >
              {t('subscribePopupTitle')}
            </Typography>
            <SubscribeForm onUserSubscription={handleUserSubscription} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 54,
    width: 'fitContent',
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
});

export default SubscribePopUp;
