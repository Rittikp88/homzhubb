import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import {
  LandingScreen,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';
import { User } from '@homzhub/common/src/domain/models/User';

const mock = jest.fn();

describe('Landing Screen Component', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      user: {
        full_name: 'John Doe',
        email: 'johndoe@gmail.com',
        country_code: 'IN',
        phone_number: '9876543210',
        access_token: 'accesstoken',
        refresh_token: 'refreshtoken',
      },
      logout: mock,
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<LandingScreen {...props} t={(key: string): string => key} />);
  });

  it('should render landing screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to Add Property Screen', () => {
    // @ts-ignore
    component.find('[testID="btnAddProperty"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call logout', () => {
    // @ts-ignore
    component.find('[testID="lblLogout"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should verify data from mapStateToProps', () => {
    const user = {
      full_name: 'John Doe',
      email: 'johndoe@gmail.com',
      country_code: '+91',
      phone_number: '9876543210',
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };
    const mockedState = {
      user: {
        ...initialUserState,
        user,
      },
      property: {
        ...initialPropertyState,
      },
    };
    // @ts-ignore
    const state = mapStateToProps(mockedState);
    const deserializedUser = ObjectMapper.deserialize(User, user);
    expect(state.user).toStrictEqual(deserializedUser);
  });

  it('should dispatch logout', () => {
    const dispatch = jest.fn();
    const logoutPayload = {
      refresh_token: 'refresh_token',
    };
    mapDispatchToProps(dispatch).logout(logoutPayload);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: UserActionTypes.AUTH.LOGOUT,
      payload: logoutPayload,
    });
  });
});
