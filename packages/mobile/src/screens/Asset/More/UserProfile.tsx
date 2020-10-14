import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, DetailsCard, ProgressBar } from '@homzhub/mobile/src/components';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UserProfileScreen>;
type IOwnProps = libraryProps;

interface IOwnState {
  userProfile: UserProfileModel | null;
}

class UserProfile extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    userProfile: {} as UserProfileModel,
  };

  public async componentDidMount(): Promise<void> {
    const response = await UserRepository.getUserProfile();

    this.setState({
      userProfile: response,
    });
  }

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { userProfile } = this.state;

    if (!userProfile) {
      return null;
    }
    const {
      profileProgress,
      fullName,
      phoneNumber,
      email,
      emailVerified,
      userAddress,
      emergencyContact,
      workInfo,
    } = userProfile;

    const emergencyContactArray = emergencyContact
      ? [
          { icon: icons.filledUser, text: emergencyContact.name },
          { icon: icons.phone, text: emergencyContact.phoneNumber },
          { icon: icons.email, text: emergencyContact.email },
        ]
      : undefined;

    return (
      <AnimatedProfileHeader sectionHeader={t('assetMore:profile')} onBackPress={this.goBack}>
        <View style={styles.container}>
          <View style={styles.profileImage}>
            <View style={styles.initialsContainer}>
              <Text type="large" textType="regular" style={styles.initials}>
                {StringUtils.getInitials(fullName || '')}
              </Text>
            </View>
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
            progress={profileProgress || 0}
            width={theme.viewport.width > 400 ? 350 : 330}
          />
          <DetailsCard
            headerInfo={{ title: 'Basic Details', icon: icons.noteBook, onPress: this.onPress }}
            details={[
              { icon: icons.filledUser, text: fullName },
              { icon: icons.phone, text: phoneNumber },
              { icon: icons.email, text: email, type: 'EMAIL', emailVerified },
              { icon: icons.marker, text: userAddress && userAddress.length > 0 ? userAddress[0].addressLine1 : '' },
            ]}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Change Password', icon: icons.rightArrow, onPress: this.onPress }}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Emergency Contact', icon: icons.noteBook, onPress: this.onPress }}
            details={emergencyContactArray}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: 'Work Information', icon: icons.noteBook, onPress: this.onPress }}
            details={
              workInfo
                ? [
                    { icon: icons.company, text: workInfo.companyName },
                    { icon: icons.email, text: workInfo.workEmail },
                  ]
                : undefined
            }
            onVerifyPress={this.onPress}
          />
        </View>
      </AnimatedProfileHeader>
    );
  };

  private onPress = (): void => {};

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation()(UserProfile);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
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
  initialsContainer: {
    ...(theme.circleCSS(80) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  initials: {
    color: theme.colors.white,
  },
});
