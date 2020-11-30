import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, FontWeightType } from '@homzhub/common/src/components/atoms/Text';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  children: React.ReactElement;
  title?: string;
  sectionHeader?: string;
  sectionTitleType?: FontWeightType;
  onBackPress?: () => void;
  isOuterScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: boolean;
}

const AnimatedProfileHeader = (props: IProps): React.ReactElement => {
  const {
    title = '',
    sectionHeader,
    isOuterScrollEnabled,
    sectionTitleType = 'bold',
    children,
    onBackPress,
    keyboardShouldPersistTaps = false,
  } = props;
  const userProfile = useSelector(UserSelector.getUserProfile);
  const navigation = useNavigation();

  const onProfilePress = useCallback(() => {
    navigation.navigate(ScreensKeys.More, {
      screen: ScreensKeys.UserProfileScreen,
      initial: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <>
        <StatusBarComponent backgroundColor={theme.colors.primaryColor} isTranslucent barStyle="light-content" />
        <View style={styles.headerContainer}>
          <Text type="regular" textType="semiBold" style={styles.title}>
            {title}
          </Text>
          <TouchableOpacity onPress={onProfilePress}>
            <Avatar
              isOnlyAvatar
              imageSize={35}
              fullName={userProfile?.fullName ?? 'User'}
              image={userProfile?.profilePicture ?? ''}
              initialsContainerStyle={styles.initialsContainer}
            />
          </TouchableOpacity>
        </View>
      </>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ? 'always' : 'never'}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isOuterScrollEnabled}
        nestedScrollEnabled
      >
        <>
          <View style={styles.headingView} />
          <View style={styles.scrollView}>
            {onBackPress && (
              <View style={styles.header}>
                <Icon
                  size={24}
                  name={icons.leftArrow}
                  color={theme.colors.primaryColor}
                  style={styles.iconStyle}
                  onPress={onBackPress}
                />
                <Text type="small" textType={sectionTitleType}>
                  {sectionHeader}
                </Text>
              </View>
            )}
            {children}
          </View>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

const memoizedComponent = React.memo(AnimatedProfileHeader);
export { memoizedComponent as AnimatedProfileHeader };

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
    borderBottomWidth: 8,
    borderBottomColor: theme.colors.green,
  },
  initialsContainer: {
    ...(theme.circleCSS(35) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  headerContainer: {
    backgroundColor: theme.colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.viewport.width > 400 ? (PlatformUtils.isIOS() ? 30 : 40) : 30,
    paddingBottom: 10,
  },
  title: {
    color: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPaddingTop,
    backgroundColor: theme.colors.white,
  },
  iconStyle: {
    paddingRight: 12,
  },
});
