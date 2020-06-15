import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import ServiceDetailScreen from '@homzhub/mobile/src/screens/Service/ServiceDetailScreen';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

const mockStore = configureStore([]);

describe('Service Detail Screen', () => {
  let store: any;
  let component: any;
  let props: any;

  const params = {
    index: 1,
  };

  beforeEach(async () => {
    store = mockStore({
      service: {
        serviceData: ServicesData,
      },
    });
    props = {
      services: ServicesData,
      navigation: {
        navigate: jest.fn(),
        route: { params },
      },
    };
    await I18nService.init();
    component = shallow(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <ServiceDetailScreen {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component.dive().dive().dive())).toMatchSnapshot();
  });
});
