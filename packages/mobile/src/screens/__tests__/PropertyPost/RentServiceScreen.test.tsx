import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import RentServices from '@homzhub/mobile/src/screens/PropertyPost/RentServices';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';

const mockStore = configureStore([]);

describe('Rent Services Screen Component', () => {
  let store: any;
  let component: ShallowWrapper;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      property: {
        propertyDetails: {
          rentServices: RentServicesData,
        },
      },
    });
    props = {
      getRentServiceList: jest.fn(),
      rentServices: RentServicesData,
      user: {
        full_name: 'John Doe',
        email: 'johndoe@gmail.com',
        country_code: 'IN',
        phone_number: '9876543210',
        access_token: 'accesstoken',
        refresh_token: 'refreshtoken',
      },
      navigation: {
        navigate: jest.fn(),
      },
    };
    await I18nService.init();
    component = shallow(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <RentServices {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  it('should render rent services screen', () => {
    expect(toJson(component.dive().dive().dive())).toMatchSnapshot();
  });
});
