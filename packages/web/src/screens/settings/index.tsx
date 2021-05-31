import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import SettingsTab from '@homzhub/web/src/screens/settings/components/SettingsTab';
import SettingsMobile from '@homzhub/web/src/screens/settings/components/SettingsMobile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Settings: FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getUserPreferences());
    }
  }, [isLoggedIn]);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);

  return !isMobile ? <SettingsTab /> : <SettingsMobile />;
};

export default Settings;
