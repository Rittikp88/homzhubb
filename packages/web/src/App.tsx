import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { BrowserRouter } from 'react-router-dom';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { AppRouter } from '@homzhub/web/src/router/AppRouter';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { configureStore } from '@homzhub/common/src/modules/store';
import { Toast } from '@homzhub/common/src/components/molecules/Toast';
import ErrorBoundary from '@homzhub/web/src/components/hoc/ErrorBoundary';

import '@homzhub/web/src/globalStyles.scss';

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
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    if (userData) {
      store.dispatch(UserActions.loginSuccess(userData));
    }
    await I18nService.init();
    this.setState({ isLocalizationInitialised: true });
  };

  public render = (): React.ReactNode => {
    const { isLocalizationInitialised } = this.state;

    if (!isLocalizationInitialised) {
      return null;
    }

    return (
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <AppRouter />
            <FlashMessage position="top" MessageComponent={this.renderToast} />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;
}
