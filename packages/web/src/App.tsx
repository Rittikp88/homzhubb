import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { Welcome } from '@homzhub/common/src/components';
import { I18nService } from '../../common/src/services/Localization/i18nextService';

interface IState {
  isLocalizationInitialised: boolean;
}

export class App extends React.PureComponent<{}, IState> {
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
      <I18nextProvider i18n={I18nService.instance}>
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <Welcome />
          </ScrollView>
        </SafeAreaView>
      </I18nextProvider>
    );
  };
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
});
