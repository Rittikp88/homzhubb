import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';
import { ServiceSteps, ServiceStepsWithVerification } from '@homzhub/common/src/mocks/ServiceSteps';
import {
  AssetPackageSteps,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Asset/Record/AssetPackageSteps';

const mock = jest.fn();

describe('Service List Steps Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      serviceSteps: ServiceSteps,
      serviceCategory: { id: 1, typeOfSale: TypeOfSale.FIND_TENANT },
      getServiceStepsDetails: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <AssetPackageSteps
        {...props}
        t={(key: string): string => key}
        route={{ params: { name: 'Some Listing', id: 1 }, isExact: true, path: '', url: '' }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot', () => {
    props = {
      serviceSteps: ServiceStepsWithVerification,
      serviceCategory: { id: 1, typeOfSale: TypeOfSale.FIND_TENANT },
      getServiceStepsDetails: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };

    component = shallow(
      <AssetPackageSteps
        {...props}
        t={(key: string): string => key}
        route={{ params: { name: 'Some Listing', id: 1 }, isExact: true, path: '', url: '' }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate on Continue', () => {
    // @ts-ignore
    component.find('[testID="btnContinue"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate back', () => {
    // @ts-ignore
    component.find('[testID="lblNavigate"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should return service steps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        servicesSteps: ServiceSteps,
      },
      search: {
        ...initialSearchState,
      },
      asset: {
        ...initialAssetState,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.serviceSteps).toBe(ServiceSteps);
  });

  it('should dispatch getServiceStepsDetails', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).getServiceStepsDetails({ serviceCategoryId: 1, serviceId: 1 });
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: PropertyActionTypes.GET.SERVICE_STEPS,
      payload: { serviceCategoryId: 1, serviceId: 1 },
    });
  });
});
