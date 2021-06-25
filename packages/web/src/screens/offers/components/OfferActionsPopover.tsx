import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import RejectOfferForm from '@homzhub/common/src/components/organisms/RejectOfferForm';
import OfferReasonView from '@homzhub/web/src/screens/offers/components/OfferReasonView';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  offerActionType: OfferAction | null;
  offer: Offer;
}

const OfferActionsPopover: React.FC<IProps> = (props: IProps) => {
  const { popupRef, offerActionType, offer } = props;
  const renderActionsPopover = (): React.ReactNode => {
    switch (offerActionType) {
      case OfferAction.ACCEPT:
        return <View />;
      case OfferAction.REJECT:
        return <RejectOfferForm onClosePopover={onClosePopover} />;
      case OfferAction.REASON:
        return <OfferReasonView offer={offer} />;
      default:
        return <View />;
    }
  };
  const onClosePopover = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const offerPopoverTypes = {
    [OfferAction.REJECT.toString()]: {
      title: t('offers:rejectOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.REASON.toString()]: {
      title: t('offers:rejectionReason'),
      styles: {
        height: '425px',
      },
    },
  };
  const offerPopoverType = offerActionType && offerPopoverTypes[offerActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {offerPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onClosePopover}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        {renderActionsPopover()}
      </View>
    );
  };

  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          ...offerPopoverType?.styles,
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onClosePopover,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default OfferActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  verticalStyle: {
    marginVertical: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
