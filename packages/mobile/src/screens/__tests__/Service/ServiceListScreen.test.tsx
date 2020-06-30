import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import {
  ServiceListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Service/ServiceListScreen';

const mock = jest.fn();
describe('Service List Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      getServiceDetails: mock,
      services: ServicesData,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <ServiceListScreen
        {...props}
        t={(key: string): string => key}
        route={{ params: { serviceId: 1 }, isExact: true, path: '', url: '' }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previous screen ', () => {
    // @ts-ignore
    component.find('[testID="animatedServiceHeader"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to Service details screen ', () => {
    // @ts-ignore
    component.find('[testID="toPress"]').at(0).prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        servicesInfo: ServicesData,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.services).toStrictEqual(ServicesData);
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).getServiceDetails(1);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_DETAILS,
      payload: 1,
    });
  });
});
