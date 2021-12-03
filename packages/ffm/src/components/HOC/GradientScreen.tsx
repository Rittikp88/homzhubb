import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';

interface IProps {
  children: React.ReactNode;
  screenTitle?: string;
  pageTitle?: string;
  isScrollable?: boolean;
  onGoBack?: () => void;
  isUserHeader?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
  pageHeaderStyle?: ViewStyle;
}

const GradientScreen = (props: IProps): React.ReactElement => {
  const {
    screenTitle,
    children,
    isScrollable,
    onGoBack,
    isUserHeader = false,
    containerStyle,
    pageTitle,
    pageHeaderStyle,
    loading = false,
  } = props;
  const user = useSelector(UserSelector.getUserProfile);
  return (
    <HandleBack onBack={onGoBack}>
      <ImageBackground
        source={require('../../../../common/src/assets/images/background.png')}
        style={[styles.background, !isUserHeader && styles.userBackground]}
      >
        {isUserHeader ? (
          <View style={styles.userHeader}>
            <Text type="regular" textType="semiBold" style={styles.title} maxLength={25}>
              {screenTitle}
            </Text>
            <TouchableOpacity>
              <Avatar isOnlyAvatar imageSize={34} fullName={user?.name} />
            </TouchableOpacity>
          </View>
        ) : (
          !!screenTitle && (
            <Text type="small" textType="semiBold" style={styles.title}>
              {screenTitle}
            </Text>
          )
        )}
      </ImageBackground>
      <View style={[styles.childrenContainer, containerStyle]}>
        {onGoBack && (
          <View style={[styles.header, pageHeaderStyle]}>
            <TouchableOpacity onPress={onGoBack}>
              <Icon name={icons.leftArrow} size={18} />
            </TouchableOpacity>
            {!!pageTitle && (
              <Text type="small" textType="semiBold" style={styles.pageTitle}>
                {pageTitle}
              </Text>
            )}
          </View>
        )}
        {isScrollable ? (
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </KeyboardAwareScrollView>
        ) : (
          children
        )}
      </View>
      <Loader visible={loading} />
    </HandleBack>
  );
};

export default GradientScreen;

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 200,
  },
  title: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  childrenContainer: {
    flex: 1,
    marginTop: -80,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginHorizontal: 16,
    padding: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBackground: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignContent: 'center',
    paddingTop: '15%',
  },
  pageTitle: {
    marginHorizontal: 6,
    color: theme.colors.darkTint1,
  },
});
