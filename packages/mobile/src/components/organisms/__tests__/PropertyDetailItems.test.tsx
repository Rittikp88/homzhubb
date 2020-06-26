import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import PropertyDetailItems from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { AreaUnit } from '@homzhub/common/src/mocks/AreaUnit';

const mock = jest.fn();

describe('Property Details Item Component', () => {
  let component: ShallowWrapper;
  let props: any;
  let spaceAvailable: any;

  beforeEach(async () => {
    spaceAvailable = {
      bedroom: 1,
      bathroom: 1,
      balcony: 1,
      floorNumber: 1,
      totalFloors: 1,
      carpetArea: '1000',
      areaUnit: 'Sq.ft',
    };
    props = {
      areaUnits: AreaUnit,
      spaceAvailable,
      propertyGroupSelectedIndex: 0,
      propertyGroupTypeSelectedIndex: 0,
      carpetAreaError: false,
      onPropertyGroupChange: mock,
      onPropertyGroupTypeChange: mock,
      onSpaceAvailableValueChange: mock,
    };
    await I18nService.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should render property details items component with data', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call onPropertyGroupSelect', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="btngrpPropertyGroup"]').prop('onItemSelect')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onPropertyGroupTypeSelect', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="btngrpPropertyGroupType"]').prop('onItemSelect')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onCarpetareaChange', () => {
    props = { ...props, data: PropertyAssetGroupData, onCommercialPropertyChange: mock, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="txtipCarpetArea"]').prop('onChangeText')();
    expect(mock).toHaveBeenCalled();
  });

  it('should not call onCarpetareaChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="txtipCarpetArea"]').prop('onChangeText')();
    expect(mock).toHaveBeenCalledTimes(0);
  });

  it('should call onSpaceAvailableValueChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 0 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="ftlist"]').prop('onValueChange')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onSpaceAvailableValueChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="ftlist"]').at(0).prop('onValueChange')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onAreaUnitChange', () => {
    props = { ...props, data: PropertyAssetGroupData, onCommercialPropertyChange: mock, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="dpnAreaUnit"]').prop('onDonePress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should not call onAreaUnitChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    component.dive().dive().dive().find('[testID="dpnAreaUnit"]').prop('onDonePress')();
    expect(mock).toHaveBeenCalledTimes(0);
  });

  it('should return value for space type', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PropertyDetailItems {...props} />
      </I18nextProvider>
    );
    // @ts-ignore
    const { findSpaceTypeValue } = component.dive().dive().dive().instance();
    const bathroom = findSpaceTypeValue({ id: 1, name: 'Bathroom' });
    expect(bathroom).toStrictEqual(1);
    const balcony = findSpaceTypeValue({ id: 1, name: 'Balcony' });
    expect(balcony).toStrictEqual(1);
    const bedroom = findSpaceTypeValue({ id: 1, name: 'Bedroom' });
    expect(bedroom).toStrictEqual(1);
    const defaultValue = findSpaceTypeValue({ id: 1, name: 'Other' });
    expect(defaultValue).toStrictEqual(0);
  });
});
