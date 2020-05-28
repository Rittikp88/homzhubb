import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import SignUpScreen from '@homzhub/mobile/src/screens/Auth/SignUpScreen';
import configureStore from 'redux-mock-store';
import { SocialMediaData } from '@homzhub/common/src/mocks/socialMedia';
import { Animated } from 'react-native';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const mockStore = configureStore([]);

describe('SignUp Screen', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      user: { socialProviders: SocialMediaData },
    });
    props = {
      socialMediaProviders: SocialMediaData,
      isNewUser: true,
      animatedValue: Animated.Value,
      loginSuccess: jest.fn(),
      getSocialMedia: jest.fn(),
    };
    await I18nService.init();
    component = TestRenderer.create(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <SignUpScreen {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  it('should render signup screen', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
