import React from 'react';
import { StatusBar, StatusBarStyle, StyleSheet, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';

interface ICommonHeaderProps {
  icon?: string;
  onIconPress?: () => void;
  type?: 'primary' | 'secondary';
  isHeadingVisible?: boolean;
  isBarVisible?: boolean;
  title?: string;
  testID?: string;
}
const STATUSBAR_HEIGHT = PlatformUtils.isIOS() ? 34 : StatusBar.currentHeight;

const Header = (props: ICommonHeaderProps): React.ReactElement => {
  const {
    title,
    onIconPress,
    type = 'primary',
    icon = icons.leftArrow,
    isHeadingVisible = true,
    isBarVisible = true,
    testID,
  } = props;

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
        <StatusBarComponent backgroundColor={backgroundColor} isTranslucent barStyle={barStyle as StatusBarStyle} />
      </View>
      <View style={[styles.container, { backgroundColor }]} testID={testID}>
        <Icon name={icon} size={22} color={textColor} style={styles.icon} onPress={onIconPress} />
        {isHeadingVisible && (
          <Text numberOfLines={1} type="small" textType="semiBold" style={[styles.title, { color: textColor }]}>
            {title ?? ''}
          </Text>
        )}
      </View>
      {isBarVisible && <View style={styles.bar} />}
    </>
  );
};

const memoizedComponent = React.memo(Header);
export { memoizedComponent as Header };

const BOTTOM_PADDING = 12;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: BOTTOM_PADDING,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    height: 4,
    backgroundColor: theme.colors.green,
  },
  title: {
    textAlign: 'center',
    width: 300,
  },
  icon: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    left: 16,
  },
});
