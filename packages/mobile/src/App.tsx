import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { store } from '@homzhub/common/src/modules/store';
import { RootNavigator } from '@homzhub/mobile/src/navigation/RootNavigator';
import { Toast } from '@homzhub/mobile/src/components/molecules/Toast';

interface IState {
  booting: boolean;
  isLoggedIn: boolean;
  isOnBoardingCompleted: boolean;
}

export default class App extends React.PureComponent<{}, IState> {
  public state = {
    booting: true,
    isLoggedIn: false,
    isOnBoardingCompleted: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.bootUp();
  };

  public render = (): React.ReactNode => {
    const { booting, isLoggedIn, isOnBoardingCompleted } = this.state;

    return (
      <Provider store={store}>
        <RootNavigator isLoggedIn={isLoggedIn} booting={booting} showOnBoarding={!isOnBoardingCompleted} />
        <FlashMessage position="bottom" MessageComponent={this.renderToast} />
      </Provider>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;

  private bootUp = async (): Promise<void> => {
    await I18nService.init();
    const isLoggedIn = (await StorageService.get<boolean>(StorageKeys.USER)) ?? false;
    const isOnBoardingCompleted = (await StorageService.get<boolean>(StorageKeys.IS_ONBOARDING_COMPLETED)) ?? false;
    setTimeout(() => {
      this.setState({ booting: false, isLoggedIn, isOnBoardingCompleted });
    }, 500);
  };
}
