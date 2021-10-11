import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import ServiceTicketList from '@homzhub/common/src/components/organisms/ServiceTicketList';
import ServiceTicketsActionsPopover, {
  ServiceTicketAction,
} from '@homzhub/web/src/screens/serviceTickets/components/ServiceTicketsActionsPopover';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const ServiceTickets: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoading = useSelector(TicketSelectors.getTicketLoader);
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);

  useEffect(() => {
    dispatch(TicketActions.getTickets());
  }, []);

  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const onAddTicket = (): void => {
    onOpenModal();
  };

  const navigateToDetail = (payload: ICurrentTicket): void => {
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.SERVICE_TICKET_DETAILS,
      params: { ...payload },
    });
  };

  return (
    <View style={styles.container}>
      <ServiceTicketList
        onAddTicket={onAddTicket}
        navigateToDetail={navigateToDetail}
        isFromMore
        isDesktop={isDesktop}
        isTablet={isTablet}
      />
      <ServiceTicketsActionsPopover
        serviceTicketActionType={ServiceTicketAction.ADD_REQUEST}
        popupRef={popupRef}
        onCloseModal={onCloseModal}
      />
      <Loader visible={isLoading} />
    </View>
  );
};

export default ServiceTickets;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'column',
    maxWidth: '100%',
  },
});