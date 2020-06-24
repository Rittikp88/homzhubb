import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';

const mock = jest.fn();
jest.mock('@homzhub/common/src/services/storage/StorageService', () => {
  return {
    get: jest.fn(),
  };
});

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
      logout: mock,
      navigation: {
        navigate: mock,
      },
    };
    await I18nService.init();
    component = mount(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <LandingScreen {...props} />
        </I18nextProvider>
      </Provider>,
    ) as any;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render landing screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to Add Property Screen', () => {
    component.find('[testID="addProperty"]').at(1).prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call logout', () => {
    component.find('[testID="logout"]').at(1).prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
