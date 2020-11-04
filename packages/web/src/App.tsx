import React from 'react';
import { Provider } from 'react-redux';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { configureStore } from '@homzhub/common/src/modules/store';
import { AppRouter } from '@homzhub/web/src/router/AppRouter';

interface IState {
  isLocalizationInitialised: boolean;
}

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

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
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  };
}
