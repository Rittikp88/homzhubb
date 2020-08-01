import React from 'react';
import { View, StyleSheet, StatusBar, StatusBarStyle, StyleProp, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

interface IProps {
  backgroundColor: string;
  isTranslucent: boolean;
  barStyle?: StatusBarStyle;
  statusBarStyle?: StyleProp<ViewStyle>;
}

const StatusBarComponent = (props: IProps): React.ReactElement => {
  const { isTranslucent, backgroundColor, barStyle = 'dark-content', statusBarStyle = {} } = props;
  return (
    <View style={[styles.statusBar, { backgroundColor }, statusBarStyle]}>
      <StatusBar translucent={isTranslucent} backgroundColor={backgroundColor} barStyle={barStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: PlatformUtils.isIOS() ? 30 : 0,
  },
});

const memoizedComponent = React.memo(StatusBarComponent);
export { memoizedComponent as StatusBarComponent };
