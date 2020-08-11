import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';

interface ICommonHeaderProps {
  icon: string;
  onIconPress?: () => void;
  type?: 'primary' | 'secondary';
  isHeadingVisible?: boolean;
  title?: string;
  testID?: string;
}
const STATUSBAR_HEIGHT = PlatformUtils.isIOS() ? 34 : StatusBar.currentHeight;

export class Header extends React.PureComponent<ICommonHeaderProps, {}> {
  public render(): React.ReactNode {
    const { type = 'primary', icon, onIconPress, isHeadingVisible = true, title, testID } = this.props;

    let backgroundColor = theme.colors.primaryColor;
    let barStyle = 'light-content';
    let textColor = theme.colors.white;
    if (type === 'secondary') {
      backgroundColor = theme.colors.white;
      textColor = theme.colors.darkTint1;
      barStyle = 'dark-content';
    }

    return (
      <>
        <View style={{ height: STATUSBAR_HEIGHT, backgroundColor }}>
          <StatusBar
            translucent
            backgroundColor={backgroundColor}
            barStyle={barStyle as 'light-content' | 'dark-content'}
          />
        </View>
        <View style={[styles.container, { backgroundColor }]} testID={testID}>
          <Icon name={icon} size={22} color={textColor} style={styles.icon} onPress={onIconPress} />
          {isHeadingVisible && (
            <Text numberOfLines={1} type="small" textType="semiBold" style={[styles.title, { color: textColor }]}>
              {title ?? ''}
            </Text>
          )}
        </View>
      </>
    );
  }
}

const BOTTOM_PADDING = 12;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: BOTTOM_PADDING,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 300,
  },
  icon: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    left: 16,
  },
});
