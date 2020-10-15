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
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

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
    const { profileProgress, fullName, basicDetailsArray, emergencyContactArray, workInfoArray } = userProfile;

    return (
      <AnimatedProfileHeader sectionHeader={t('profile')} onBackPress={this.goBack}>
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
            title={t('profile')}
            progress={profileProgress || 0}
            width={theme.viewport.width > 400 ? 350 : 330}
          />
          <DetailsCard
            headerInfo={{ title: t('basicDetails'), icon: icons.noteBook, onPress: this.onPress }}
            details={basicDetailsArray}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: t('changePassword'), icon: icons.rightArrow, onPress: this.onPress }}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('emergencyContact'),
              icon: emergencyContactArray ? icons.noteBook : undefined,
              onPress: this.onPress,
            }}
            details={emergencyContactArray}
            onVerifyPress={this.onPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('workInformation'),
              icon: workInfoArray ? icons.noteBook : undefined,
              onPress: this.onPress,
            }}
            details={workInfoArray}
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

export default withTranslation(LocaleConstants.namespacesKey.assetMore)(UserProfile);

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
