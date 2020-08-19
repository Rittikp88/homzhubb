import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { configureStore } from '@homzhub/common/src/modules/store';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { RootNavigator } from '@homzhub/mobile/src/navigation/RootNavigator';
import { Toast } from '@homzhub/mobile/src/components/molecules/Toast';
import { BlankScreen } from '@homzhub/mobile/src/screens/BlankScreen'; // For Testing on UI
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IState {
  booting: boolean;
  showBlankScreen: boolean; // For Testing on UI
}

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

export default class App extends React.PureComponent<{}, IState> {
  public state = {
    booting: true,
    showBlankScreen: false, // For Testing on UI, change to false for regular flow
  };

  public componentDidMount = async (): Promise<void> => {
    await this.bootUp();
  };

  public render = (): React.ReactNode => {
    const { booting, showBlankScreen } = this.state;
    // For UI Testing Remove once app goes live
    if (showBlankScreen) {
      return <BlankScreen />;
    }

    return (
      <Provider store={store}>
        <RootNavigator booting={booting} />
        <FlashMessage position="bottom" MessageComponent={this.renderToast} />
      </Provider>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;

  private bootUp = async (): Promise<void> => {
    await I18nService.init();
    const isOnBoardingCompleted = (await StorageService.get<boolean>(StorageKeys.IS_ONBOARDING_COMPLETED)) ?? false;
    store.dispatch(UserActions.updateOnBoarding(isOnBoardingCompleted));

    const userData = await StorageService.get<IUser>(StorageKeys.USER);
    if (userData) {
      store.dispatch(UserActions.loginSuccess(userData));
    }

    setTimeout(() => {
      this.setState({ booting: false });
    }, 500);
  };
}
