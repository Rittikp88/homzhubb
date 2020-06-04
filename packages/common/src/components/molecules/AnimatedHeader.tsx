import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, TextSizeType, WithShadowView, DetailedHeader } from '@homzhub/common/src/components';

interface IHeaderProps {
  children?: React.ReactElement;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  title?: string;
  subTitle?: string;
  subTitleColor?: string;
  subTitleType?: TextSizeType;
  linkText?: string;
  onIconPress?: () => void;
  onLinkPress?: () => void;
  headerContainerStyle?: StyleProp<ViewStyle>;
}

const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 100;

export const AnimatedHeader = (props: IHeaderProps): React.ReactElement => {
  const { children, title, subTitle, linkText, onIconPress, onLinkPress } = props;

  const stickyHeader = (): React.ReactElement => {
    return (
      <WithShadowView>
        <View key="sticky-header" style={styles.stickySection}>
          <Text type="regular" textType="semiBold" style={styles.title}>
            {title}
          </Text>
        </View>
      </WithShadowView>
    );
  };

  const fixedHeader = (): React.ReactElement => {
    return (
      <View key="fixed-header" style={styles.fixedSection}>
        <Icon name={icons.close} size={22} color={theme.colors.darkTint4} onPress={onIconPress} />
      </View>
    );
  };

  return (
    <ParallaxScrollView
      backgroundColor={theme.colors.white}
      stickyHeaderHeight={STICKY_HEADER_HEIGHT}
      parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
      backgroundSpeed={10}
      renderForeground={(): React.ReactElement => (
        <DetailedHeader title={title} subTitle={subTitle} linkText={linkText} onLinkPress={onLinkPress} />
      )}
      renderStickyHeader={(): React.ReactElement => stickyHeader()}
      renderFixedHeader={(): React.ReactElement => fixedHeader()}
    >
      {children}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  stickySection: {
    height: PlatformUtils.isIOS() ? 95 : 80,
    paddingTop: PlatformUtils.isIOS() ? 55 : 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.disabled,
  },
  title: {
    color: theme.colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  fixedSection: {
    position: 'absolute',
    bottom: PlatformUtils.isIOS() ? 20 : 40,
    left: 20,
  },
});
