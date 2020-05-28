import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin');
jest.mock('@homzhub/common/src/assets/images/landingScreenLogo.png');
jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/common/src/components/', () => 'Label');
jest.mock('@homzhub/common/src/components/', () => 'Button');
jest.mock('@homzhub/mobile/src/components/atoms/Svg', () => 'SVGUri');
jest.mock('@homzhub/mobile/src/screens/PropertyPost/GradientBackground', () => 'GradientBackground');
const mockStore = configureStore([]);

describe('Landing Screen Component', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      user: {
        user: {
          full_name: 'John Doe',
          email: 'johndoe@gmail.com',
          country_code: 'IN',
          phone_number: '9876543210',
          access_token: 'accesstoken',
          refresh_token: 'refreshtoken',
        },
      },
    });
    props = {
      user: {
        full_name: 'John Doe',
        email: 'johndoe@gmail.com',
        country_code: 'IN',
        phone_number: '9876543210',
        access_token: 'accesstoken',
        refresh_token: 'refreshtoken',
      },
      logoutSuccess: jest.fn(),
    };
    await I18nService.init();
    component = TestRenderer.create(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <LandingScreen {...props} />
        </I18nextProvider>
      </Provider>
    ).toJSON();
  });

  it('should render landing screen', () => {
    expect(component).toMatchSnapshot();
  });
});
