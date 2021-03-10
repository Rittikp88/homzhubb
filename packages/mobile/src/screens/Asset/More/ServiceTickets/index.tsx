import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import ServiceTicketList from '@homzhub/common/src/components/organisms/ServiceTicketList';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ServiceTicket = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const isLoading = useSelector(TicketSelectors.getTicketLoader);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const onAddTicket = (): void => {
    navigate(ScreensKeys.AddServiceTicket);
  };

  const onNavigateToDetail = (): void => {
    navigate(ScreensKeys.ServiceTicketDetail);
  };
  // HANDLERS

  return (
    <UserScreen title={t('assetMore:more')} pageTitle={t('serviceTickets')} onBackPress={goBack} loading={isLoading}>
      <ServiceTicketList onAddTicket={onAddTicket} navigateToDetail={onNavigateToDetail} isFromMore />
    </UserScreen>
  );
};

export default ServiceTicket;
