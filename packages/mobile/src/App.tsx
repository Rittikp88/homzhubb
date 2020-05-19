import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { store } from '@homzhub/common/src/modules/store';
import { RootNavigator } from '@homzhub/mobile/src/navigation/RootNavigator';
import { Toast } from '@homzhub/mobile/src/components/molecules/Toast';

interface IState {
  isLocalizationInitialised: boolean;
}

export default class App extends React.PureComponent<{}, IState> {
  public state = {
    isLocalizationInitialised: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await I18nService.init();
    setTimeout(() => {
      this.setState({ isLocalizationInitialised: true });
    }, 500);
  };

  public render = (): React.ReactNode => {
    const { isLocalizationInitialised } = this.state;

    return (
      <Provider store={store}>
        <RootNavigator isLocalizationLoading={isLocalizationInitialised} />
        <FlashMessage position="bottom" MessageComponent={this.renderToast} />
      </Provider>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;
}
