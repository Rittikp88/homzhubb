import React, { memo, ReactElement, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IUserScreenProps {
  title: string;
  pageTitle?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  scrollEnabled?: boolean;
  isGradient?: boolean;
  loading?: boolean;
  isOuterScrollEnabled?: boolean;
  onBackPress?: () => void;
}

// Constants for Gradient background
const { headerGradientA, headerGradientB, headerGradientC } = theme.colors;
const gradientProps = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: [headerGradientA, headerGradientB, headerGradientC],
  locations: [0.2, 0.7, 0.9],
};

const UserScreen = (props: IUserScreenProps): ReactElement => {
  const {
    children,
    title,
    pageTitle,
    scrollEnabled = true,
    isGradient = false,
    loading = false,
    isOuterScrollEnabled,
    onBackPress,
  } = props;
  let { backgroundColor = theme.colors.white } = props;

  let headerColor = theme.colors.primaryColor;
  if (isGradient) {
    headerColor = theme.colors.transparent;
    backgroundColor = '';
  }

  const userProfile = useSelector(UserSelector.getUserProfile);
  const navigation = useNavigation();

  const onProfilePress = useCallback(() => {
    navigation.navigate(ScreensKeys.More, {
      screen: ScreensKeys.UserProfileScreen,
      initial: false,
    });
  }, [navigation]);

  const renderHeader = useCallback((): React.ReactElement => {
    return (
      <>
        <View style={{ backgroundColor: headerColor }}>
          <StatusBar barStyle="light-content" statusBarBackground={headerColor} />
          <View style={[styles.header, { backgroundColor: headerColor }]}>
            <Text type="regular" textType="semiBold" style={styles.title}>
              {title}
            </Text>
            <TouchableOpacity onPress={onProfilePress}>
              <Avatar
                isOnlyAvatar
                imageSize={34}
                fullName={userProfile?.fullName ?? ''}
                image={userProfile?.profilePicture ?? ''}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bar} />
      </>
    );
  }, [title, onProfilePress, userProfile?.fullName, userProfile?.profilePicture, headerColor]);

  const renderPageHeader = (): React.ReactNode => {
    if (!pageTitle && !onBackPress) {
      return null;
    }

    return (
      <View style={styles.pageHeaderContainer}>
        <Icon
          size={20}
          name={icons.leftArrow}
          color={theme.colors.primaryColor}
          style={styles.backIconStyle}
          onPress={onBackPress}
        />
        <Text type="small" textType="semiBold" style={styles.pageTitle}>
          {pageTitle}
        </Text>
      </View>
    );
  };

  return (
    <>
      {isGradient ? <LinearGradient {...gradientProps}>{renderHeader()}</LinearGradient> : renderHeader()}
      <View style={[styles.screen, { backgroundColor }]}>
        {renderPageHeader()}
        {scrollEnabled ? (
          <KeyboardAwareScrollView
            bounces={false}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            scrollEnabled={isOuterScrollEnabled}
            nestedScrollEnabled
          >
            {children}
          </KeyboardAwareScrollView>
        ) : (
          children
        )}
      </View>
      <Loader visible={loading} />
    </>
  );
};

const memoizedComponent = memo(UserScreen);
export { memoizedComponent as UserScreen };

const MARGIN_TOP = 96;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: -MARGIN_TOP,
    borderRadius: 4,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 20 + MARGIN_TOP,
    paddingHorizontal: theme.layout.screenPadding,
  },
  pageHeaderContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.white,
  },
  pageTitle: {
    color: theme.colors.darkTint1,
  },
  backIconStyle: {
    marginEnd: 16,
  },
  bar: {
    height: 4,
    backgroundColor: theme.colors.green,
  },
});
