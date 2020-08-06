import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Animated } from 'react-native';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components';

interface IProps {
  children: React.ReactElement;
  title: string;
  onIconPress?: () => void;
}
interface IState {
  scrollY: Animated.Value;
}

export class AnimatedProfileHeader extends Component<IProps, IState> {
  public state = {
    scrollY: new Animated.Value(0),
  };

  public render(): React.ReactNode {
    const { scrollY } = this.state;
    const { children } = this.props;
    const headerHeight = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [100, 50],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <>
          <StatusBarComponent backgroundColor={theme.colors.primaryColor} isTranslucent barStyle="light-content" />
          {this.renderHeader()}
        </>
        <Animated.View style={[styles.headingView, { height: headerHeight }]} />
        <ScrollView
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  // TODO: Need to update user name
  private renderHeader = (): React.ReactElement => {
    const { title, onIconPress } = this.props;
    return (
      <View style={styles.headerContainer}>
        <Text type="regular" textType="semiBold" style={styles.title}>
          {title}
        </Text>
        <View style={styles.initialsContainer}>
          <Text type="small" textType="regular" style={styles.initials} onPress={onIconPress}>
            {StringUtils.getInitials('User')}
          </Text>
          <Icon name={icons.roundFilled} size={18} color={theme.colors.green} style={styles.activeIcon} />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    position: 'absolute',
    top: '13%',
    bottom: 0,
    paddingHorizontal: theme.layout.screenPadding,
  },
  headingView: {
    backgroundColor: theme.colors.primaryColor,
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  initials: {
    color: theme.colors.white,
  },
  headerContainer: {
    backgroundColor: theme.colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 30,
  },
  title: {
    color: theme.colors.white,
  },
  activeIcon: {
    position: 'absolute',
    left: '65%',
    top: 26,
  },
});
