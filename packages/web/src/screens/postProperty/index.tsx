import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import PropertyDetailsForm from '@homzhub/web/src/screens/postProperty/components/PropertyDetailsForm';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PermissionsServiceWeb, PERMISSION_TYPE_WEB } from '@homzhub/web/src/services/Permissions';

const PostProperty: FC = () => {
  useEffect(() => {
    // console.log('PlatfromUtils => ', PlatformUtils.isWeb());
    const permission = PermissionsServiceWeb.checkPermission(PERMISSION_TYPE_WEB.location);
    console.log('Permission => ', permission);
    // GeolocationService.getCurrentPosition(
    //   (res: GeolocationResponse) => {
    //     console.log('location response => ', res);
    //   },
    //   (error) => {
    //     console.error({ message: 'errorFetchingLocation' });
    //   }
    // );
  }, []);
  return (
    <View>
      <PropertyDetailsForm />
    </View>
  );
};
export default PostProperty;
