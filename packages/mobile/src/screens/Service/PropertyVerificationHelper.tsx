import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
// import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { RNMarkdown } from '@homzhub/common/src/components';
// import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type OwnProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyVerificationHelper>;
type Props = OwnProps;

interface IPropertyVerificationHelperState {
  markdown: string;
}

class PropertyVerificationHelper extends React.PureComponent<Props, IPropertyVerificationHelperState> {
  public state = {
    markdown: '',
  };

  public componentDidMount = async (): Promise<void> => {
    // await this.getPropertyVerificationHelperData();
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const { markdown } = this.state;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
          iconColor="white"
          iconStyle={styles.iconStyle}
          onIconPress={this.navigateBack}
          isHeadingVisible
          title={t('propertyVerification:webviewHeader')}
          titleType="regular"
          titleFontType="semiBold"
          titleStyle={styles.headerTitle}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.markdownContainer}>
            {/* TODO: Send the data from state rather hardcoded value */}
            <RNMarkdown>{markdown}</RNMarkdown>
            <RNMarkdown>
              ## Markdown for Property Verification Screen! {'\n\n'}
              You can **emphasize** what you want, or just _suggest it_ 😏…{'\n'}
            </RNMarkdown>
          </View>
        </ScrollView>
      </View>
    );
  }

  // TODO: Uncomment when the api is ready
  // public getPropertyVerificationHelperData = async (): Promise<void> => {
  //   try {
  //     const response = await ServiceRepository.getPropertyVerificationHelperMarkdown();
  //     // TODO: Add the proper value to state here once the api is ready.
  //     this.setState({
  //       markdown: response,
  //     });
  //   } catch (error) {
  //     AlertHelper.error({ message: error.message });
  //   }
  // };

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation()(PropertyVerificationHelper);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconStyle: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  markdownContainer: {
    margin: theme.layout.screenPadding,
  },
});
