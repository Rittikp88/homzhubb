import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ProfileModalContent from '@homzhub/web/src/screens/profile/components/ProfileModalContent';

interface IProfilePopover {
  popupRef: React.RefObject<PopupActions>;
  formType: ProfileUserFormTypes;
}

export enum ProfileUserFormTypes {
  EmergencyContact = 'EmergencyContact',
  WorkInfo = 'WorkInfo',
  BasicDetails = 'BasicDetails',
}

const ProfilePopover: React.FC<IProfilePopover> = (props: IProfilePopover) => {
  const { popupRef, formType } = props;
  return (
    <Popover
      forwardedRef={popupRef}
      content={<ProfileModal formType={formType} popupRef={popupRef} />}
      popupProps={{
        position: 'center center',
        on: [],
        arrow: false,
        closeOnDocumentClick: false,
        children: undefined,
        modal: true,
      }}
    />
  );
};

const ProfileModal: React.FC<IProfilePopover> = (props: IProfilePopover) => {
  const styles = contentStyles;
  const { formType, popupRef } = props;
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const { t } = useTranslation();
  const profileFormElements = {
    EmergencyContact: {
      modalTitleHeader: t(''),
    },
    WorkInfo: {
      modalTitleHeader: t('moreProfile:editHeaderText', { title: t('moreProfile:workInformation') }),
    },
    BasicDetails: {
      modalTitleHeader: t(''),
    },
  };
  const { modalTitleHeader } = profileFormElements[formType];
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Typography size="regular" fontWeight="semiBold" style={styles.modalHeaderTitle}>
          {modalTitleHeader || t('common:congratulations')}
        </Typography>
        <Icon
          name={icons.close}
          color={theme.colors.darkTint7}
          size={24}
          style={styles.modalHeaderIcon}
          onPress={handlePopupClose}
        />
      </View>
      <View style={styles.modalContent}>
        <ProfileModalContent formType={formType} handlePopupClose={handlePopupClose} />
      </View>
    </View>
  );
};

const contentStyles = StyleSheet.create({
  modalContainer: {
    width: '37.5vw',
  },
  modalHeader: {
    height: '64px',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContent: {
    minHeight: '200px',
  },
  modalHeaderTitle: {
    marginLeft: '24px',
  },
  modalHeaderIcon: {
    marginRight: '24px',
  },
});

export default ProfilePopover;