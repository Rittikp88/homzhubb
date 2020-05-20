import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';

interface IHeaderProps {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  title?: string;
  subTitle?: string;
  linkText?: string;
  onIconPress: () => void;
  onLinkPress?: () => void;
  animatedStyle?: StyleProp<Animated.AnimatedWithChildren>;
  headerContainerStyle?: StyleProp<ViewStyle>;
}

export const Header = (props: IHeaderProps): React.ReactElement => {
  const {
    icon,
    iconColor,
    iconSize,
    title,
    subTitle,
    linkText,
    animatedStyle = {},
    headerContainerStyle = {},
    onIconPress,
    onLinkPress,
  } = props;
  return (
    <View style={headerContainerStyle}>
      <Icon
        name={icon}
        size={iconSize || 16}
        color={iconColor || theme.colors.darkTint4}
        style={styles.iconStyle}
        onPress={onIconPress}
      />
      {title && (
        <View style={styles.headerContent}>
          <Animated.Text style={[styles.animatedText, animatedStyle]}>{title}</Animated.Text>
          <Text type="small" style={styles.text}>
            {subTitle}{' '}
            <Text type="small" style={styles.linkText} onPress={onLinkPress}>
              {linkText}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    padding: 16,
  },
  headerContent: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  animatedText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  text: {
    marginVertical: 6,
    color: theme.colors.darkTint3,
  },
  linkText: {
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
});
