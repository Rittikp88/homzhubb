import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { StatusBar, IStatusBarProps } from '@homzhub/mobile/src/components/atoms/StatusBar';

export interface IHeaderProps {
  type?: 'primary' | 'secondary';
  icon?: string;
  iconRight?: string;
  title?: string;
  barVisible?: boolean;
  children?: React.ReactNode;
  statusBarProps?: IStatusBarProps;
  opacity?: number;
  onIconPress?: () => void;
  onIconRightPress?: () => void;
  testID?: string;
}
const BOTTOM_PADDING = 12;

const Header = (props: IHeaderProps): React.ReactElement => {
  const {
    title,
    iconRight,
    type = 'primary',
    icon = icons.leftArrow,
    barVisible = false,
    testID,
    children,
    statusBarProps,
    opacity = 1,
    onIconPress,
    onIconRightPress,
  } = props;

  let backgroundColor = theme.colors.primaryColor;
  let textColor = theme.colors.white;
  let statusBarType = 'light-content';
  if (type === 'secondary') {
    backgroundColor = theme.colors.white;
    textColor = theme.colors.darkTint1;
    statusBarType = 'dark-content';
  }

  return (
    <>
      <StatusBar
        statusBarBackground={backgroundColor}
        barStyle={statusBarType as 'light-content' | 'dark-content'}
        {...statusBarProps}
      />
      <View style={[styles.container, { backgroundColor }]} testID={testID}>
        <Icon name={icon} size={22} color={textColor} style={styles.icon} onPress={onIconPress} />
        <Animated.Text numberOfLines={1} style={[styles.title, { color: textColor, opacity }]}>
          {title ?? ''}
        </Animated.Text>
        {iconRight && (
          <Icon name={iconRight} size={22} color={textColor} style={styles.iconRight} onPress={onIconRightPress} />
        )}
      </View>
      {children}
      {barVisible && <View style={styles.bar} />}
    </>
  );
};

const memoizedComponent = React.memo(Header);
export { memoizedComponent as Header };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  bar: {
    height: 4,
    backgroundColor: theme.colors.green,
  },
  title: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    width: 300,
  },
  icon: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    left: 12,
  },
  iconRight: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    right: 16,
  },
});
