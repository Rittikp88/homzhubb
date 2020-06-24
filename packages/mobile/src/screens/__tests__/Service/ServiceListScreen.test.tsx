import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import ServiceListScreen from '@homzhub/mobile/src/screens/Service/ServiceListScreen';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

const mockStore = configureStore([]);

describe('Service List Screen', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      property: {
        servicesInfo: ServicesData,
      },
    });
    props = {
      getServiceDetails: jest.fn(),
      services: ServicesData,
      navigation: {
        navigate: jest.fn(),
      },
    };
    await I18nService.init();
    component = shallow(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <ServiceListScreen {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });
});
