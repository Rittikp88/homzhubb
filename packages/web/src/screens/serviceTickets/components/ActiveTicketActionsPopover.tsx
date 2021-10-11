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
import RequestQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/RequestQuoteForm';
import SubmitQuote from '@homzhub/web/src/screens/serviceTickets/components/SubmitQuote';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  activeTicketActionType: TicketActionTypes | null;
  onCloseModal: () => void;
  handleServiceTicketsAction?: (value: TicketActionTypes) => void;
  onSuccessCallback: () => void;
}

const ActiveTicketActionsPopover: React.FC<IProps> = (props: IProps) => {
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const { activeTicketActionType, popupRef, onCloseModal, onSuccessCallback } = props;

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (activeTicketActionType) {
      case TicketActionTypes.REQUEST_QUOTE:
        return <RequestQuoteForm onSuccess={onSuccessCallback} />;
      case TicketActionTypes.SUBMIT_QUOTE:
        return <SubmitQuote onSuccess={onSuccessCallback} />;
      default:
        return null;
    }
  };

  const serviceTicketsPopoverTypes = {
    [TicketActionTypes.REQUEST_QUOTE.toString()]: {
      title: t('serviceTickets:requestQuote'),
      styles: {
        height: '620px',
      },
    },
    [TicketActionTypes.SUBMIT_QUOTE.toString()]: {
      title: t('serviceTickets:submitQuote'),
      styles: {
        height: '620px',
      },
    },
  };
  const ServiceTicketsPopoverType =
    activeTicketActionType && serviceTicketsPopoverTypes[activeTicketActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {ServiceTicketsPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
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
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          ...ServiceTicketsPopoverType?.styles,
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default ActiveTicketActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
