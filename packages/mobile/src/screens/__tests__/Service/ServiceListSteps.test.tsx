import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import ServiceListSteps from '@homzhub/mobile/src/screens/Service/ServiceListSteps';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin');
jest.mock('@homzhub/common/src/components/', () => 'Label');
jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/mobile/src/components/molecules/Header', () => 'Header');

const mockStore = configureStore([]);

describe('Service List Steps Screen', () => {
  let store: any;
  let component: any;
  let props: any;
  beforeEach(async () => {
    store = mockStore({
      service: {
        servicesSteps: ServiceSteps[0].steps,
      },
    });
    props = {
      navigation: {
        navigate: jest.fn(),
      },
    };
    await I18nService.init();
    component = shallow(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <ServiceListSteps {...props} />
        </I18nextProvider>
      </Provider>
    );
  });
  it('should render snapshot', () => {
    expect(toJson(component.dive().dive().dive())).toMatchSnapshot();
  });
});
