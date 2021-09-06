import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import RequestQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/RequestQuoteForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const RequestQuote = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { requestQuote } = useSelector(TicketSelectors.getTicketLoaders);

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('requestQuote')}
      onBackPress={goBack}
      loading={requestQuote}
      keyboardShouldPersistTaps
    >
      <RequestQuoteForm onSuccess={goBack} />
    </UserScreen>
  );
};

export default RequestQuote;
