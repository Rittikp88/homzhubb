import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Logo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { Text, Label, Button, SVGUri } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';

interface IStateProps {
  user: UserProfile | null;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyPostLandingScreen>;
type Props = IStateProps & libraryProps;
const IMAGE = 'https://homzhub-bucket.s3.amazonaws.com/Group+1168.svg';

export class AssetLandingScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, user } = this.props;
    return (
      <>
        <StatusBarComponent backgroundColor={theme.colors.white} isTranslucent />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Logo width={60} height={60} style={styles.logo} />
            <Text type="large" textType="semiBold" style={styles.title}>
              {t('welcomeUser', { username: user?.fullName })}
            </Text>
            <Text type="regular" textType="regular" style={styles.description}>
              {t('description')}
            </Text>
            <View style={styles.imageContainer}>
              <SVGUri preserveAspectRatio="xMidYMid meet" uri={IMAGE} />
            </View>
            <Label type="large" textType="regular" style={styles.label}>
              {t('searchProject')}
            </Label>
            <Button
              title={t('addProperty')}
              type="primary"
              onPress={this.onAddProperty}
              containerStyle={styles.addProperty}
              testID="btnAddProperty"
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  public onAddProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserProfile(state),
  };
};

export default connect<IStateProps, null, WithTranslation, IState>(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLandingScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 296,
    height: 132,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginTop: 28,
    marginBottom: 36,
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  label: {
    marginTop: 44,
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  addProperty: {
    flex: 0,
    marginTop: 16,
  },
});
