import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IHeaderProps {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  title?: string;
  subTitle?: string;
  subTitleColor?: string;
  subTitleType?: TextSizeType;
  linkText?: string;
  onIconPress?: () => void;
  onLinkPress?: () => void;
  isAnimation?: boolean;
  animatedValue?: Animated.AnimatedValue;
  headerContainerStyle?: StyleProp<ViewStyle>;
}

export const AnimatedHeader = (props: IHeaderProps): React.ReactElement => {
  const {
    icon,
    iconColor,
    iconSize,
    title,
    subTitle,
    subTitleType,
    subTitleColor,
    linkText,
    onIconPress,
    onLinkPress,
    isAnimation = false,
    animatedValue,
    headerContainerStyle = {},
  } = props;

  const { headerMaxHeight, headerMinHeight } = theme.headerConstants;
  const scrollDistance = headerMaxHeight - headerMinHeight;

  const getAnimatedHeaderStyle = (value: Animated.AnimatedValue): Animated.AnimatedInterpolation => {
    return value.interpolate({
      inputRange: [0, scrollDistance],
      outputRange: [headerMaxHeight, headerMinHeight],
      extrapolate: 'clamp',
    });
  };

  const getAnimatedStyles = (value: Animated.AnimatedValue): Animated.AnimatedWithChildren => {
    return {
      fontSize: value.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [24, 16],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateX: value.interpolate({
            inputRange: [0, scrollDistance],
            outputRange: [0, 150],
            extrapolate: 'clamp',
          }),
        },
        {
          translateY: value.interpolate({
            inputRange: [0, scrollDistance],
            outputRange: [0, -50],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  };

  let animatedHeaderStyle = {};
  let titleStyle = { ...styles.animatedText };
  if (isAnimation && animatedValue) {
    animatedHeaderStyle = [styles.headerView, { height: getAnimatedHeaderStyle(animatedValue) }];
    titleStyle = { ...styles.animatedText, ...getAnimatedStyles(animatedValue) };
  }

  const isHeaderContentVisible = !!(title || subTitle);
  const customStyle = customizedStyles(isAnimation, isHeaderContentVisible, subTitleColor);

  return (
    <Animated.View style={animatedHeaderStyle}>
      <View style={[customStyle.headerStyle, headerContainerStyle]}>
        <Icon
          name={icon}
          size={iconSize || 22}
          color={iconColor || theme.colors.darkTint4}
          style={styles.iconStyle}
          onPress={onIconPress}
        />
        {isHeaderContentVisible && (
          <View style={customStyle.headerContent}>
            <Animated.Text style={titleStyle}>{title}</Animated.Text>
            <Text
              type={subTitleType || 'small'}
              textType={subTitleType ? 'semiBold' : 'regular'}
              style={customStyle.text}
            >
              {subTitle}{' '}
              <Text type="small" style={styles.linkText} onPress={onLinkPress}>
                {linkText}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    padding: 16,
  },
  animatedText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  linkText: {
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
  headerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
});

// TODO: Need to check return type
const customizedStyles = (isAnimation: boolean, isVisible: boolean, textColor: string | undefined): any => ({
  headerStyle: {
    flex: isAnimation ? 1 : 0,
    marginTop: PlatformUtils.isIOS() && isVisible ? 50 : 20,
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: !isAnimation && isVisible ? 1 : 0,
  },
  text: {
    marginVertical: textColor ? 0 : 6,
    color: textColor || theme.colors.darkTint3,
  },
  headerContent: {
    marginVertical: textColor ? 8 : 16,
    paddingHorizontal: 24,
  },
});
