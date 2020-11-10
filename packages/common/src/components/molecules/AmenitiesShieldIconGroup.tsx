import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  iconSize: number;
  onBadgePress: () => void;
}

export const AmenitiesShieldIconGroup: FC<IProps> = ({ onBadgePress, iconSize }: IProps) => {
  return (
    <View style={styles.badgesContainer}>
      <Icon
        name={icons.badge}
        size={iconSize}
        color={theme.colors.warning}
        style={styles.badges}
        onPress={onBadgePress}
        testID="info"
      />
      <Icon
        name={icons.badge}
        size={iconSize}
        color={theme.colors.warning}
        style={styles.badges}
        onPress={onBadgePress}
      />
      <Icon
        name={icons.badge}
        size={iconSize}
        color={theme.colors.disabledPreference}
        style={styles.badges}
        onPress={onBadgePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badgesContainer: {
    flexDirection: 'row',
  },
  badges: {
    marginHorizontal: PlatformUtils.isWeb() ? 0 : 3,
    marginLeft: PlatformUtils.isWeb() ? 4 : 0,
  },
});
