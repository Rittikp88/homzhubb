import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Image, Text } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, DetailsCard, ProgressBar } from '@homzhub/mobile/src/components';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UserProfileScreen>;
type IOwnProps = libraryProps;

class UserProfile extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactElement => {
    return (
      <AnimatedProfileHeader>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon
              size={30}
              name={icons.leftArrow}
              color={theme.colors.primaryColor}
              style={styles.iconStyle}
              onPress={this.onPress}
            />
            <Text type="small" textType="bold">
              Profile
            </Text>
          </View>
          <View style={styles.profileImage}>
            <Image style={styles.roundBorder} width={80} height={80} source={images.landingScreenLogo} />
            <View style={[styles.cameraContainer, styles.roundBorder]}>
              <Icon
                size={16}
                name={icons.camera}
                color={theme.colors.white}
                style={styles.cameraIcon}
                onPress={this.onPress}
              />
            </View>
          </View>
          <ProgressBar
            containerStyles={styles.progressBar}
            title="Profile"
            progress={90}
            width={theme.viewport.width > 400 ? 350 : 330}
          />
          <DetailsCard
            headerInfo={{ title: 'Basic Details', icon: icons.document, onPress: this.onPress }}
            details={[
              { icon: icons.document, text: 'Darlene Robertson' },
              { icon: icons.document, text: 'Darlene Robertson', type: 'EMAIL' },
            ]}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Change Password', icon: icons.rightArrow, onPress: this.onPress }}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Emergency Contact', icon: icons.document, onPress: this.onPress }}
            details={[{ icon: icons.document, text: 'Darlene Robertson' }]}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Work Information', icon: icons.document, onPress: this.onPress }}
            details={[{ icon: icons.document, text: 'Darlene Robertson' }]}
            onVerifyPress={this.onPress}
          />
        </View>
      </AnimatedProfileHeader>
    );
  };

  private onPress = (): void => {};
}

export default withTranslation()(UserProfile);

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.layout.screenPaddingTop,
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    paddingRight: 12,
  },
  roundBorder: {
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 50,
  },
  profileImage: {
    marginTop: 16,
    alignItems: 'center',
  },
  cameraContainer: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primaryColor,
    bottom: 21,
    left: 24,
  },
  cameraIcon: {
    alignSelf: 'center',
    position: 'relative',
    top: 2,
  },
  progressBar: {
    marginBottom: 24,
  },
});
