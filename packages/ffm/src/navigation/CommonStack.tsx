import React from 'react';
import ComingSoon from '@homzhub/ffm/src/screens/Common/ComingSoon';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

export type CommonStackParamList = {
  // common screen
};

/**
 * Common Screen for multiple stacks
 * @param Stack
 */

export const getCommonScreen = (Stack: any): React.ReactElement => {
  return (
    <>
      {/* Example */}
      <Stack.Screen name={ScreenKeys.OnBoarding} component={ComingSoon} />
    </>
  );
};
