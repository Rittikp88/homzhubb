import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { AreaUnit } from '@homzhub/common/src/mocks/AreaUnit';
import { PropertyDetailsItems } from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';

const mock = jest.fn();

describe('Property Details Item Component', () => {
  let component: ShallowWrapper;
  let props: any;
  let spaceAvailable: any;

  beforeEach(() => {
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
  });

  afterEach(() => jest.clearAllMocks());

  it('should render property details items component with data', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call onPropertyGroupSelect', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="btngrpPropertyGroup"]').prop('onValueChange')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onPropertyGroupTypeSelect', () => {
    props = { ...props, data: PropertyAssetGroupData };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="btngrpPropertyGroupType"]').prop('onItemSelect')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onCarpetareaChange', () => {
    props = { ...props, data: PropertyAssetGroupData, onCommercialPropertyChange: mock, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="txtipCarpetArea"]').prop('onChangeText')();
    expect(mock).toHaveBeenCalled();
  });

  it('should not call onCarpetareaChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="txtipCarpetArea"]').prop('onChangeText')();
    expect(mock).toHaveBeenCalledTimes(0);
  });

  it('should call onSpaceAvailableValueChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 0 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="ftlist"]').prop('onValueChange')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onSpaceAvailableValueChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="ftlist"]').at(0).prop('onValueChange')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call onAreaUnitChange', () => {
    props = { ...props, data: PropertyAssetGroupData, onCommercialPropertyChange: mock, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="dpnAreaUnit"]').prop('onDonePress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should not call onAreaUnitChange', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="dpnAreaUnit"]').prop('onDonePress')();
    expect(mock).toHaveBeenCalledTimes(0);
  });

  it('should return value for space type', () => {
    props = { ...props, data: PropertyAssetGroupData, propertyGroupSelectedIndex: 1 };
    component = shallow(<PropertyDetailsItems {...props} t={(key: string): string => key} />);
    // @ts-ignore
    const { findSpaceTypeValue } = component.instance();
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
