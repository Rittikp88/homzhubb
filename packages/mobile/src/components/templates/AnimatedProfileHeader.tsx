import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';

interface IProps {
  children: React.ReactElement;
  title: string;
  onIconPress?: () => void;
}

export class AnimatedProfileHeader extends Component<IProps, {}> {
  public render(): React.ReactNode {
    const { children } = this.props;
    return (
      <View style={styles.container}>
        <>
          <StatusBarComponent backgroundColor={theme.colors.primaryColor} isTranslucent barStyle="light-content" />
          {this.renderHeader()}
        </>
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <>
            <View style={styles.headingView} />
            <View style={styles.scrollView}>{children}</View>
          </>
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
    position: 'relative',
    paddingHorizontal: theme.layout.screenPadding,
    bottom: 85,
  },
  headingView: {
    backgroundColor: theme.colors.primaryColor,
    height: 100,
  },
  initialsContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
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
    paddingTop: theme.viewport.width > 400 ? (PlatformUtils.isIOS() ? 30 : 40) : 10,
    paddingBottom: 10,
  },
  title: {
    color: theme.colors.white,
  },
});
