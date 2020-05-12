import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { store } from '@homzhub/common/src/modules/store';
import { Welcome } from '@homzhub/common/src/components';

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
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <Welcome />
          </ScrollView>
        </SafeAreaView>
      </Provider>
    );
  };
}

const white = 'white';
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: white,
  },
});
