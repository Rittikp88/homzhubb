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
import AcceptOfferPopOver from '@homzhub/web/src/screens/offers/components/AcceptOfferPopOver';
import OfferReasonView from '@homzhub/web/src/screens/offers/components/OfferReasonView';
import WithdrawOffer from '@homzhub/web/src/screens/offers/components/WithdrawOffer';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import AcceptOffer from '@homzhub/web/src/screens/offers/components/AcceptOffer';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  offerActionType: OfferAction | null;
  offer?: Offer;
  asset?: Asset;
  compareData?: IOfferCompare;
  handleOfferAction: (value: OfferAction) => void;
}

const OfferActionsPopover: React.FC<IProps> = (props: IProps) => {
  const { popupRef, offerActionType, offer, compareData = {}, handleOfferAction } = props;
  const renderActionsPopover = (): React.ReactNode => {
    switch (offerActionType) {
      case OfferAction.ACCEPT:
        return <AcceptOffer handleOfferAction={handleOfferAction} compareData={compareData} />;
      case OfferAction.REJECT:
        return <RejectOfferForm onClosePopover={onClosePopover} />;
      case OfferAction.REASON:
        return <OfferReasonView offer={offer} />;
      case OfferAction.CANCEL:
        return <WithdrawOffer onClosePopover={onClosePopover} />;
      case OfferAction.CONFIRMARION:
        return <AcceptOfferPopOver onClosePopover={onClosePopover} />;
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
    [OfferAction.CANCEL.toString()]: {
      title: t('offers:cancelOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.ACCEPT.toString()]: {
      title: t('offers:acceptOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.CONFIRMARION.toString()]: {
      title: '',
      styles: {
        height: '620px',
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
