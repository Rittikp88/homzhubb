// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';
import { PropertyDetails } from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';

const mock = jest.fn();

describe('Property Details Screen Component', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      getPropertyDetails: jest.fn(),
      getPropertyDetailsById: jest.fn(),
      property: PropertyAssetGroupData,
      spaceAvailable: ResidentialPropertyTypeData,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<PropertyDetails {...props} t={(key: string): string => key} />);
  });

  it('should render property details screen', () => {
    component.instance().onPropertyGroupChange(1);
    component.instance().onPropertyGroupTypeChange(1);
    component.instance().onSpaceAvailableValueChange(SpaceAvailableTypes.BATHROOM, 1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render property details screen for different index property', () => {
    component.instance().onPropertyGroupChange(2);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render property details screen', () => {
    props = {
      getPropertyDetails: jest.fn(),
      getPropertyDetailsById: jest.fn(),
      property: null,
      spaceAvailable: ResidentialPropertyTypeData,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<PropertyDetails {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previos screen', () => {
    // @ts-ignore
    component.find('[testID="propertyLocation"]').prop('onNavigate')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call the project name', async () => {
    const data = {
      project_name: 'Project A',
      unit_number: '12',
      block_number: 'A',
      latitude: '109.12',
      longitude: '110.12',
      carpet_area: '1000',
      carpet_area_unit: 'Sq.ft',
      floor_number: 1,
      total_floors: 2,
      asset_type: 0,
    };
    jest.spyOn(AssetRepository, 'getAssetById').mockImplementation(() => Promise.resolve(data));
    const response = await AssetRepository.getAssetById(1);
    component.setState({ projectName: response.project_name });
    expect(component.state('projectName')).toStrictEqual(data.project_name);
  });
});
