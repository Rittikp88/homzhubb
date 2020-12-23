import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import React, { useState, useEffect, memo } from 'react';
import { View, StatusBar, StatusBarStyle, NativeModules } from 'react-native';

const { StatusBarManager } = NativeModules;

export interface IStatusBarProps {
  barStyle: StatusBarStyle;
  statusBarBackground: string;
  isStatusBarHidden?: boolean;
  isStatusBarTranslucent?: boolean;
}

const HomzhubStatusBar = (props: IStatusBarProps): React.ReactElement => {
  const { barStyle, statusBarBackground, isStatusBarHidden = false, isStatusBarTranslucent = false } = props;

  const [barHeight, setBarHeight] = useState(0);
  useEffect(() => {
    if (PlatformUtils.isIOS()) {
      StatusBarManager.getHeight(({ height }: { height: number }) => {
        setBarHeight(height);
      });
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: statusBarBackground,
        height: barHeight,
      }}
    >
      <StatusBar
        animated
        translucent={isStatusBarTranslucent}
        hidden={isStatusBarHidden}
        backgroundColor={statusBarBackground}
        barStyle={barStyle}
      />
    </View>
  );
};

const memoizedComponent = memo(HomzhubStatusBar);
export { memoizedComponent as StatusBar };
