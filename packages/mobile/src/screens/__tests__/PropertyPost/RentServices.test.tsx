import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';
import {
  RentServices,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/PropertyPost/RentServices';
import { User } from '@homzhub/common/src/domain/models/User';

const mock = jest.fn();
describe('Rent Services Screen Component', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      getRentServiceList: mock,
      serviceList: RentServicesData,
      user: {
        full_name: 'John Doe',
        email: 'johndoe@gmail.com',
        country_code: 'IN',
        phone_number: '9876543210',
        access_token: 'accesstoken',
        refresh_token: 'refreshtoken',
      },
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<RentServices {...props} t={(key: string): string => key} />);
    component.setState({ isSelected: true, selectedItem: 1 });
  });

  it('should render rent services screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previous screen', () => {
    // @ts-ignore
    component.find('[testID="headerIconPress"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should handle selected service', () => {
    // @ts-ignore
    component.find('[testID="icoFilled"]').prop('onPress')(1);
    expect(component.state('selectedItem')).toBe(1);
  });

  it('should handle unselected service', () => {
    // @ts-ignore
    component.find('[testID="icoDisabled"]').at(0).prop('onPress')(2);
    expect(component.state('isSelected')).toBe(true);
    expect(component.state('selectedItem')).toBe(2);
  });

  it('should handle map state to props', () => {
    const userData = {
      full_name: 'John Doe',
      email: 'johndoe@gmail.com',
      country_code: 'IN',
      phone_number: '9876543210',
      access_token: 'accesstoken',
      refresh_token: 'refreshtoken',
    };
    const mockedState = {
      user: {
        ...initialUserState,
        user: userData,
      },
      property: {
        ...initialPropertyState,
        propertyDetails: {
          ...initialPropertyState.propertyDetails,
          rentServices: RentServicesData,
        },
      },
    };
    // @ts-ignore
    const state = mapStateToProps(mockedState);
    const deserializedUser = ObjectMapper.deserialize(User, userData);
    expect(state.user).toStrictEqual(deserializedUser);
    expect(state.serviceList).toStrictEqual(RentServicesData);
  });

  it('should handle the mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).getRentServiceList();
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PropertyActionTypes.GET.RENT_SERVICE_LIST,
    });
  });
});
