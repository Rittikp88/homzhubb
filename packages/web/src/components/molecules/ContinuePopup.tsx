import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Popover from '@homzhub/web/src/components/atoms/Popover';

interface IProps {
  title?: string;
  subTitle?: string;
  buttonSubText?: string;
  buttonTitle?: string;
  iconName?: string;
  iconColor?: string;
}
const ContinuePopup: React.FC<IProps> = (props: IProps) => {
  const { title, subTitle, buttonSubText, buttonTitle, iconName, iconColor } = props;
  const popupRef = useRef<PopupActions>(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
    console.log('Popup Component');
  }, []);
  const renderPopupCard = (): React.ReactElement => {
    return (
      <View style={styles.popupCard}>
        <Typography variant="text" size="large" style={styles.cardTitle} fontWeight="semiBold">
          {title || 'Title'}
        </Typography>
        <Typography variant="text" size="small" style={styles.cardSubTitle} fontWeight="regular">
          {subTitle || 'Subtitle'}
        </Typography>
        <Icon
          name={iconName || icons.circularCheckFilled}
          size={80}
          color={iconColor || theme.colors.green}
          style={styles.iconStyle}
        />
        <Typography variant="label" size="large" style={styles.buttonSubText} fontWeight="regular">
          {buttonSubText || 'Button SubText'}
        </Typography>
        <Button type="primary" containerStyle={styles.continueButton} title={buttonTitle || t('continue')} />
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
          closeOnDocumentClick: true,
          children: undefined,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vh',
    height: '100vh',
  },
  popupOptionStyle: {},
  popupCard: {
    height: 340,
    width: 480,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {},
  cardSubTitle: { marginVertical: 10 },
  iconStyle: { marginVertical: 30 },
  buttonSubText: {
    color: theme.colors.darkTint5,
  },
  continueButton: {
    marginVertical: 15,
    width: '80%',
  },
});
export default ContinuePopup;
