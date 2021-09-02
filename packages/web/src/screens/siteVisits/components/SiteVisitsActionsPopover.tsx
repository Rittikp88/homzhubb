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
import BookVisit from '@homzhub/web/src/screens/siteVisits/components/BookVisit';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IBookVisitProps } from '@homzhub/common/src/domain/repositories/interfaces';

export enum SiteVisitAction {
  SCHEDULE_VISIT = 'SCHEDULE_VISIT',
}

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  siteVisitActionType: SiteVisitAction | null;
  onCloseModal: () => void;
  handleSiteVisitsAction?: (value: SiteVisitAction) => void;
  paramsBookVisit?: IBookVisitProps;
}

const SiteVisitsActionsPopover: React.FC<IProps> = (props: IProps) => {
  const { siteVisitActionType, popupRef, onCloseModal, paramsBookVisit } = props;
  const renderActionsPopover = (): React.ReactNode | null => {
    switch (siteVisitActionType) {
      case SiteVisitAction.SCHEDULE_VISIT:
        return <BookVisit paramsBookVisit={paramsBookVisit as IBookVisitProps} />;
      default:
        return null;
    }
  };
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const siteVisitsPopoverTypes = {
    [SiteVisitAction.SCHEDULE_VISIT.toString()]: {
      title: t('siteVisits:schedulePropertyVisit'),
      styles: {
        height: '620px',
      },
    },
  };
  const SiteVisitsPopoverType = siteVisitActionType && siteVisitsPopoverTypes[siteVisitActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {SiteVisitsPopoverType?.title}
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
          ...SiteVisitsPopoverType?.styles,
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

export default SiteVisitsActionsPopover;

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