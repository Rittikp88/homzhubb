import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Animated } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text, TextSizeType, FontWeightType } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';

interface IProps {
  children: React.ReactElement;
  headerTitle: string;
  title: string;
  titleType?: TextSizeType;
  titleTextType?: FontWeightType;
  subTitle?: string;
  onIconPress: () => void;
  testID?: string;
}

export class AnimatedServiceList extends Component<IProps> {
  public state = {
    scrollY: new Animated.Value(0),
  };

  public render(): React.ReactNode {
    const { scrollY } = this.state;
    const { children, title, subTitle, headerTitle, onIconPress, titleType, titleTextType, testID } = this.props;
    const headerHeight = scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [140, 60],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <Header
          isHeadingVisible
          title={headerTitle}
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          titleStyle={styles.headerTitle}
          backgroundColor={theme.colors.primaryColor}
          onIconPress={onIconPress}
          testID={testID}
        />
        <Animated.View style={[styles.headingView, { height: headerHeight }]} />
        <ScrollView
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          <Text type={titleType || 'small'} textType={titleTextType || 'semiBold'} style={styles.headingStyle}>
            {title}
          </Text>
          {subTitle && (
            <Label type="large" textType="regular" style={styles.subHeading}>
              {subTitle}
            </Label>
          )}
          {children}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  scrollView: {
    width: '100%',
    position: 'absolute',
    top: '14%',
    bottom: 0,
  },
  headingView: {
    backgroundColor: theme.colors.primaryColor,
  },
  headingStyle: {
    color: theme.colors.white,
    marginHorizontal: 16,
    paddingTop: 16,
  },
  subHeading: {
    color: theme.colors.white,
    marginHorizontal: 16,
    marginTop: 6,
  },
});
