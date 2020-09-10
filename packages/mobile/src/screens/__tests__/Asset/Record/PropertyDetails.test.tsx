import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';
import {
  PropertyDetails,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';

const mock = jest.fn();

describe('Property Details Screen Component', () => {
  let component: any;
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

  it.skip('should call the project name', async () => {
    jest.spyOn(AssetRepository, 'getAssetById').mockImplementation(() => Promise.resolve(mockAsset).then());
    const response = await AssetRepository.getAssetById(1);
    component.setState({ projectName: response.projectName });
    expect(component.state('projectName')).toStrictEqual(mockAsset.project_name);
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
      search: {
        ...initialSearchState,
      },
      asset: {
        ...initialAssetState,
      },
      portfolio: {
        ...initialPortfolioState,
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
