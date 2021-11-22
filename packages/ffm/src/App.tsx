import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@homzhub/common/src/modules/store';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
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
    const selectedLanguage: SupportedLanguages | null = await StorageService.get(StorageKeys.USER_SELECTED_LANGUAGE);
    await I18nService.init(selectedLanguage || undefined);

    setBooting(false);
  };

  return (
    <Provider store={store}>
      <RootNavigator booting={booting} />
    </Provider>
  );
};

export default App;
