import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Welcome } from '@homzhub/common/src/components';
import { I18nService } from '../../common/src/services/Localization/i18nextService';

interface IState {
  isLocalizationInitialised: boolean;
}

export default class App extends React.PureComponent<{}, IState> {
  public state = {
    isLocalizationInitialised: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await I18nService.init();
    this.setState({ isLocalizationInitialised: true });
  };

  public render = (): React.ReactNode => {
    const { isLocalizationInitialised } = this.state;

    if (!isLocalizationInitialised) {
      return null;
    }

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <Welcome />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };
}

const white = 'white';
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: white,
  },
});
