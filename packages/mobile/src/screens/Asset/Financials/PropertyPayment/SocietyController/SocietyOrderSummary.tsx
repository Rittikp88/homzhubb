import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ServiceOrderSummary from '@homzhub/common/src/components/organisms/ServiceOrderSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SocietyOrderSummary = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();

  const onSuccess = (): void => {
    navigate(ScreensKeys.PaymentServices);
  };
  return (
    <UserScreen title={t('property:orderSummary')} pageTitle={t('property:payment')} onBackPress={goBack}>
      <ServiceOrderSummary onSuccess={onSuccess} />
    </UserScreen>
  );
};

export default SocietyOrderSummary;
