import React from 'react';
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Text, TextSizeType, FontWeightType } from '@homzhub/common/src/components';

interface ICommonHeaderProps {
  backgroundColor: string;
  icon: string;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: StyleProp<ViewStyle>;
  onIconPress?: () => void;
  isHeadingVisible?: boolean;
  titleType?: TextSizeType;
  titleFontType?: FontWeightType;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  testID?: string;
}
const STATUSBAR_HEIGHT = PlatformUtils.isIOS() ? 34 : StatusBar.currentHeight;

export class Header extends React.PureComponent<ICommonHeaderProps, {}> {
  public render(): React.ReactNode {
    const {
      backgroundColor,
      icon,
      iconSize,
      iconColor,
      iconStyle,
      onIconPress,
      isHeadingVisible,
      title,
      titleType,
      titleFontType,
      titleStyle = {},
      testID,
    } = this.props;
    return (
      <>
        <View style={{ height: STATUSBAR_HEIGHT, backgroundColor }}>
          <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
        </View>
        <View style={styles.container} testID={testID}>
          <Icon
            name={icon}
            size={iconSize || 22}
            color={iconColor || theme.colors.darkTint4}
            style={[styles.icon, iconStyle]}
            onPress={onIconPress}
          />
          {isHeadingVisible && (
            <Text type={titleType || 'small'} textType={titleFontType || 'semiBold'} style={[styles.text, titleStyle]}>
              {title ?? ''}
            </Text>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryColor,
  },
  icon: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  text: {
    color: theme.colors.white,
  },
});
