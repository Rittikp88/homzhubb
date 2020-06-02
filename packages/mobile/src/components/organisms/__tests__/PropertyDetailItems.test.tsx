import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import PropertyDetailItems from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin');
jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/common/src/components/', () => 'Label');
jest.mock('@homzhub/common/src/components/', () => 'HorizontalPicker');
jest.mock('@homzhub/common/src/components/', () => 'FormTextInput');
jest.mock('@homzhub/mobile/src/components/molecules/BottomSheetListView', () => 'BottomSheetListView');
jest.mock('@homzhub/mobile/src/components/molecules/ItemGroup', () => 'ItemGroup');

describe('Property Details Item Component', () => {
  let component: any;
  let props: any;

  beforeEach(async () => {
    props = {
      data: PropertyAssetGroupData,
      spaceAvailable: ResidentialPropertyTypeData,
      propertyGroupSelectedIndex: 0,
      propertyGroupTypeSelectedIndex: 0,
      onPropertyGroupChange: jest.fn(),
      onPropertyGroupTypeChange: jest.fn(),
    };
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
  });

  it('should render property details items component', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });
});
