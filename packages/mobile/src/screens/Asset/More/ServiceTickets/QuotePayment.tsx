import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import QuotePaymentForm from '@homzhub/common/src/components/organisms/ServiceTickets/QuotePaymentForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const QuotePayment = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  return (
    <UserScreen title={selectedTicket?.propertyName ?? ''} pageTitle={t('quotePayment')} onBackPress={goBack}>
      <QuotePaymentForm />
    </UserScreen>
  );
};

export default QuotePayment;
