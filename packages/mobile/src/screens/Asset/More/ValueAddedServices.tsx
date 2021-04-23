// @ts-noCheck
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { IBadgeInfo, NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ValueAddedServiceCardList } from '@homzhub/common/src/components/organisms/ValueAddedServiceCardList';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type IProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ValueAddedServices>;

export const ValueAddedServices = (props: IProps): ReactElement => {
  const { navigation } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Local States
  const [loading, setLoading] = useState(true);

  const navigateToAddPropertyScreen = (): void => {
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetLocationSearch,
    });
  };
  const apiDidLoad = (): void => {
    setLoading(false);
  };

  const render = (): ReactElement => {
    return (
      <UserScreen
        title={t('more')}
        pageTitle={t('valueAddedServices')}
        onBackPress={navigation.goBack}
        loading={loading}
      >
        <ValueAddedServiceCardList
          didLoad={apiDidLoad}
          navigateToAddPropertyScreen={navigateToAddPropertyScreen}
          navigateToService={navigateToService}
        />
      </UserScreen>
    );
  };

  const navigateToService = (
    propertyId: number,
    assetType: string,
    projectName: string,
    address: string,
    flag: React.ReactElement,
    serviceByIds: IGetServicesByIds,
    badgeInfo: IBadgeInfo,
    amenities: IAmenitiesIcons[]
  ): void => {
    navigation.navigate(ScreensKeys.ServicesForSelectedAsset, {
      propertyId,
      assetType,
      projectName,
      address,
      flag,
      serviceByIds,
      badgeInfo,
      amenities,
    });
  };

  return render();
};
