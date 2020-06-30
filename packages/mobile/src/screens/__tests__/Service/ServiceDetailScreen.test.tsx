import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import {
  ServiceDetailScreen,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Service/ServiceDetailScreen';

const mock = jest.fn();
describe('Service Detail Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      services: ServicesData,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <ServiceDetailScreen
        {...props}
        t={(key: string): string => key}
        route={{ params: { serviceId: 1 }, isExact: true, path: '', url: '' }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previous screen', () => {
    // @ts-ignore
    component.find('[testID="animatedServiceList"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should change slide number for carosuel', () => {
    component.setState({ activeSlide: 0 });
    // @ts-ignore
    component.find('[testID="carsl"]').prop('currentSlide')(1);
    expect(component.state('activeSlide')).toBe(1);
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
    mapDispatchToProps(dispatch).setCurrentServiceCategoryId(1);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PropertyActionTypes.SET.CURRENT_SERVICE_CATEGORY_ID,
      payload: 1,
    });
  });
});
