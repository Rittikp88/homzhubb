import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import ServiceTicketList from '@homzhub/common/src/components/organisms/ServiceTicketList';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ICommonNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ServiceTicket = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const { params } = useRoute();
  const isLoading = useSelector(TicketSelectors.getTicketLoader);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const param = params as ICommonNavProps;

  // HANDLERS
  const onAddTicket = (): void => {
    navigate(ScreensKeys.AddServiceTicket, { propertyId: param?.propertyId });
  };

  const onNavigateToDetail = (): void => {
    navigate(ScreensKeys.ServiceTicketDetail);
  };
  // HANDLERS

  const getTitle = (): string => {
    if (!param) return t('assetMore:more');

    return param && param.isFromDashboard ? t('assetDashboard:dashboard') : param.screenTitle ?? '';
  };

  const renderRightNode = (): React.ReactElement => {
    return (
      <TouchableOpacity onPress={onAddTicket}>
        <Icon name={icons.plus} size={30} color={theme.colors.primaryColor} />
      </TouchableOpacity>
    );
  };

  return (
    <UserScreen
      title={getTitle()}
      pageTitle={t('serviceTickets')}
      rightNode={param?.isFromPortfolio ? renderRightNode() : undefined}
      onBackPress={goBack}
      loading={isLoading}
    >
      <ServiceTicketList
        onAddTicket={onAddTicket}
        navigateToDetail={onNavigateToDetail}
        isFromMore={!param?.isFromPortfolio}
        propertyId={param?.propertyId}
      />
    </UserScreen>
  );
};

export default ServiceTicket;
