import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DetailedHeader } from '@homzhub/common/src/components';
import { Otp, mapDispatchToProps, mapStateToProps } from '@homzhub/mobile/src/screens/Auth/Otp';
import { LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { OtpNavTypes } from '../../../navigation/interfaces';
import { OtpInputs } from '../../../components';

const mock = jest.fn();

describe('OTP Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      isLoading: false,
      login: mock,
      loginSuccess: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <Otp
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            title: 'Otp',
            phone: '99999999999',
            type: OtpNavTypes.Login,
            countryCode: 'INR',
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with userData', () => {
    component = shallow(
      <Otp
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            type: OtpNavTypes.SignUp,
            countryCode: 'INR',
            userData: {
              full_name: '',
              country_code: 'INR',
              email: '',
              phone_number: '',
              password: '',
            },
            onCallback: mock,
          },
        }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should match snapshot in error', () => {
    // @ts-ignore
    component.find(OtpInputs).prop('toggleError')();
    component.setState({ error: 'Error' });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should verify otp', () => {
    // @ts-ignore
    component.find(OtpInputs).prop('bubbleOtp')('123456');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate back', () => {
    // @ts-ignore
    component.find(DetailedHeader).prop('onIconPress')();
    // @ts-ignore
    component.find('[testID="icnEdit"]').prop('onPress')();
    expect(props.navigation.goBack).toBeCalled();
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
        isLoading: false,
      },
      property: {
        ...initialPropertyState,
      },
    };
    // @ts-ignore
    const state = mapStateToProps(mockedState);
    expect(state.isLoading).toStrictEqual(false);
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const payload = {
      data: {
        action: LoginTypes.EMAIL,
        payload: {
          email: 'johndoe@gmail.com',
          password: 'Johndoe123!',
        },
      },
      onCallback: mock,
    };
    // @ts-ignore
    mapDispatchToProps(dispatch).login(payload);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN,
      payload,
    });
  });
});
