import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface ICautionMessage {
  title: string;
  message: string;
  updatePreferences: () => void;
  changeToggle: () => void;
}
const DisplayCautionModal: React.FC<ICautionMessage> = (props: ICautionMessage) => {
  const { title, message, updatePreferences, changeToggle } = props;
  const popupRef = useRef<PopupActions>(null);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  useEffect(() => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  }, []);
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      changeToggle();
      popupRef.current.close();
    }
  };

  const handlePress = (): void => {
    updatePreferences();
    handlePopupClose();
  };
  const renderPopupCard = (): React.ReactElement => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={handlePopupClose}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography variant="text" size="regular" fontWeight="semiBold">
            {title}
          </Typography>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.text}>
            {message}
          </Typography>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.text}>
            {t('common:wantToContinue')}
          </Typography>
        </View>
        <View style={styles.footer}>
          <Button title={t('common:continue')} type="secondary" containerStyle={styles.button} onPress={handlePress} />
          <Button type="primary" title={t('common:cancel')} onPress={handlePopupClose} containerStyle={styles.button} />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Popover
        forwardedRef={popupRef}
        content={renderPopupCard}
        popupProps={{
          position: 'center center',
          on: [],
          arrow: false,
          closeOnDocumentClick: false,
          children: undefined,
          modal: true,
          contentStyle: {
            width: !isMobile ? 480 : '95%',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },
  text: {
    paddingTop: 12,
    paddingBottom: 24,
    textAlign: 'center',
  },
  container: {
    marginHorizontal: '5%',
    marginVertical: 30,
    height: 300,
  },
  header: {
    flexDirection: 'row-reverse',
  },
  button: {
    width: 170,
    height: 44,
    marginLeft: 10,
  },
  image: {
    height: 120,
    width: 120,
  },
  footer: { flexDirection: 'row', position: 'absolute', bottom: 0, right: 0 },
});
export default DisplayCautionModal;
