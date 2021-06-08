import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ProspectProfileForm from '@homzhub/web/src/components/molecules/ProspectProfileForm';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  isOpen: boolean;
  userData: UserProfileModel;
  propertyLeaseType: string;
}

const TenancyFormPopover: React.FC<IProps> = (props: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const { t } = useTranslation();
  const { userData, popupRef } = props;
  const onClosePopover = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const renderForm = (): React.ReactElement => {
    return (
      <>
        <View style={styles.header}>
          <Typography size="small" fontWeight="regular" style={styles.text}>
            {t('offers:prospectProfile')}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={onClosePopover}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.bottomMargin} />
        <ProspectProfileForm
          userDetails={userData}
          editData={false}
          isTablet={isTablet}
          isMobile={isMobile}
          onClosePopover={onClosePopover}
        />
      </>
    );
  };

  return (
    <View>
      <Popover
        content={renderForm()}
        popupProps={{
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            alignItems: 'stretch',
            width: isMobile ? 300 : 400,
            height: 'fit-content',
            padding: 12,
            borderRadius: 8,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onClosePopover,
        }}
        forwardedRef={popupRef}
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
    backgroundColor: theme.colors.white,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 18,
  },
  buttonHeader: {
    flexDirection: 'row-reverse',
    paddingRight: 24,
    paddingTop: 24,
  },
  button: {
    width: '100%',
    height: 44,
    top: 60,
  },
  image: {
    height: 120,
    width: 120,
  },
  passwordConatiner: {
    paddingTop: '15%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 12,
    cursor: 'pointer',
  },
  passwordBox: {
    width: '90%',
    margin: 'auto',
    paddingTop: 18,
  },
  bottomMargin: {
    marginBottom: 18,
  },
});

export default TenancyFormPopover;
