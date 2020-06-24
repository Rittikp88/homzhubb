import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import PropertyDetails from '@homzhub/mobile/src/screens/PropertyPost/PropertyDetails';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';

const mockStore = configureStore([]);

describe('Property Details Screen Component', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      property: {
        propertyDetails: {
          propertyGroup: PropertyAssetGroupData,
          propertyGroupSpaceAvailable: ResidentialPropertyTypeData,
        },
      },
    });
    props = {
      getPropertyDetails: jest.fn(),
      getPropertyDetailsById: jest.fn(),
      property: PropertyAssetGroupData,
      spaceAvailable: ResidentialPropertyTypeData,
      navigation: {
        navigate: jest.fn(),
      },
    };
    await I18nService.init();
    component = shallow(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <PropertyDetails {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  it('should render property details screen', () => {
    expect(toJson(component.dive().dive().dive())).toMatchSnapshot();
  });
});
