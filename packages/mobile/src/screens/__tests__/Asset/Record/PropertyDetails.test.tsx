// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';
import {
  PropertyDetails,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';

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
      isLoading: false,
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
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render on space value change', () => {
    component.instance().onSpaceAvailableValueChange({ name: SpaceAvailableTypes.BATHROOM }, 1);
    component.instance().onSpaceAvailableValueChange({ name: SpaceAvailableTypes.BALCONY }, 1);
    component.instance().onSpaceAvailableValueChange({ name: SpaceAvailableTypes.BEDROOM }, 1);
    component.instance().onSpaceAvailableValueChange({ name: SpaceAvailableTypes.FLOOR_NUMBER }, 1);
    component.instance().onSpaceAvailableValueChange({ name: SpaceAvailableTypes.TOTAL_FLOORS }, 1);
    component.instance().onSpaceAvailableValueChange({ name: '' }, 1);
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

  it('should navigate to previous screen', () => {
    component.instance().onNavigateToMaps();
    component.instance().handleIconPress();
    expect(props.navigation.goBack).toBeCalled();
  });

  it('should call the project name', async () => {
    const data = {
      project_name: 'Project A',
      unit_number: '12',
      block_number: 'A',
      latitude: '109.12',
      longitude: '110.12',
      carpet_area: '1000',
      carpet_area_unit: {
        id: 1,
        name: 'SQ_FT',
        label: 'Square feet',
        title: 'Sq.ft',
      },
      floor_number: 1,
      total_floors: 2,
      asset_type: 0,
    };
    jest.spyOn(AssetRepository, 'getAssetById').mockImplementation(() => Promise.resolve(data));
    const response = await AssetRepository.getAssetById(1);
    component.setState({ projectName: response.project_name });
    expect(component.state('projectName')).toStrictEqual(data.project_name);
  });

  it('should render property details screen without property', () => {
    props = {
      ...props,
      property: null,
    };
    component = shallow(<PropertyDetails {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        isLoading: false,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.isLoading).toStrictEqual(false);
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).getPropertyDetails();
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PropertyActionTypes.GET.PROPERTY_DETAILS,
    });
  });
});
