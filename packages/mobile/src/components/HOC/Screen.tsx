import React from 'react';
import { SafeAreaView, View, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { Extrapolate } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { PageHeader, IPageHeaderProps, TITLE_HEIGHT } from '@homzhub/mobile/src/components/atoms/PageHeader';
import { Header, IHeaderProps } from '@homzhub/mobile/src/components/molecules/Header';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);
interface IProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  isLoading?: boolean;
  keyboardShouldPersistTaps?: boolean;
  backgroundColor?: string;
  headerProps?: IHeaderProps;
  pageHeaderProps?: IPageHeaderProps;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const Screen = (props: IProps): React.ReactElement => {
  const {
    children,
    isLoading = false,
    scrollEnabled = true,
    keyboardShouldPersistTaps = false,
    headerProps,
    pageHeaderProps,
    backgroundColor,
    containerStyle = {},
    contentContainerStyle = {},
  } = props;

  // Values for Header Animations
  let opacity = 1;
  let onScroll;
  if (!headerProps?.title && pageHeaderProps?.contentTitle) {
    const scrollY = new Animated.Value(0);
    // @ts-ignore
    opacity = new Animated.interpolate(scrollY, {
      inputRange: [10, TITLE_HEIGHT],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }]);
  }

  return (
    <>
      <Header {...headerProps} title={headerProps?.title ?? pageHeaderProps?.contentTitle} opacity={opacity} />
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {scrollEnabled ? (
          <AnimatedKeyboardAwareScrollView
            keyboardShouldPersistTaps={keyboardShouldPersistTaps ? 'always' : 'never'}
            showsVerticalScrollIndicator={false}
            style={[styles.container, containerStyle]}
            onScroll={onScroll}
          >
            <PageHeader {...pageHeaderProps} />
            <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
          </AnimatedKeyboardAwareScrollView>
        ) : (
          <View style={[styles.container, containerStyle]}>
            <PageHeader {...pageHeaderProps} />
            <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
          </View>
        )}
      </SafeAreaView>
      <Loader visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
  },
});
