import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { ValueAddedServiceCardList } from '@homzhub/common/src/components/organisms/ValueAddedServiceCardList';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IBadgeInfo } from '@homzhub/mobile/src/navigation/interfaces';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

const SelectProperty: FC = () => {
  const history = useHistory();
  const navigateToService = (
    propertyId: number,
    assetType: string,
    projectName = '',
    address = '',
    _flag: React.ReactElement,
    serviceByIds: IGetServicesByIds = { assetGroupId: 0, city: '', countryId: 0 },
    badgeInfo: IBadgeInfo = { color: '', title: '' },
    amenities: IAmenitiesIcons[] = [],
    attachments: Attachment[] = [],
    assetCount = 0,
    iso2Code = ''
  ): void => {
    const locationState = {
      propertyId,
      assetType,
      projectName,
      address,
      serviceByIds,
      badgeInfo,
      amenities,
      attachments,
      assetCount,
      iso2Code,
    };

    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.SELECT_SERVICES,
      params: { ...locationState },
    });
  };
  return (
    <View style={styles.container}>
      <ValueAddedServiceCardList
        didLoad={FunctionUtils.noop}
        navigateToAddPropertyScreen={FunctionUtils.noop}
        navigateToService={navigateToService}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SelectProperty;
