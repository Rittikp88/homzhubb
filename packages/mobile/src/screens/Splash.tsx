import React from 'react';
import { View } from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';

export const Splash = (): React.ReactElement => {
  return (
    <View>
      <Text type="small" textType="bold">
        Loading......
      </Text>
    </View>
  );
};
