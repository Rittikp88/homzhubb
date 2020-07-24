import React from 'react';
import { View, StyleSheet, StatusBar, StatusBarStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

interface IProps {
  backgroundColor: string;
  isTranslucent: boolean;
  barStyle?: StatusBarStyle;
}

const StatusBarComponent = (props: IProps): React.ReactElement => {
  const { isTranslucent, backgroundColor, barStyle = 'dark-content' } = props;
  return (
    <View style={styles.statusBar}>
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
