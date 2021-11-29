import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { configureStore } from '@homzhub/common/src/modules/store';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import ErrorBoundary from '@homzhub/mobile/src/components/HOC/ErrorBoundary';
import { Toast } from '@homzhub/common/src/components/molecules/Toast';
import { RootNavigator } from '@homzhub/ffm/src/navigation/RootNavigator';
import { SupportedLanguages } from '@homzhub/common/src/services/Localization/constants';

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

const App: () => React.ReactElement = () => {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    bootUp().then();
  }, []);

  const bootUp = async (): Promise<void> => {
    store.dispatch(CommonActions.getCountries());
    const selectedLanguage: SupportedLanguages | null = await StorageService.get(StorageKeys.USER_SELECTED_LANGUAGE);
    await I18nService.init(selectedLanguage || undefined);
    await AnalyticsService.initMixpanel();

    setBooting(false);
  };

  const renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootNavigator booting={booting} />
        <FlashMessage position="bottom" MessageComponent={renderToast} />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
