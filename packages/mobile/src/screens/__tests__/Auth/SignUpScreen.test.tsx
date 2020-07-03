import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { SocialMediaData } from '@homzhub/common/src/mocks/socialMedia';
import { SignUpScreen, mapDispatchToProps } from '@homzhub/mobile/src/screens/Auth/SignUpScreen';

const mock = jest.fn();

describe('SignUp Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  let instance: any;
  beforeEach(() => {
    props = {
      loginSuccess: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<SignUpScreen {...props} t={(key: string): string => key} />);
    instance = component.instance();
  });

  it('should render signup screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate back', () => {
    // @ts-ignore
    component.find('[testID="headerEvents"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to login screen', () => {
    // @ts-ignore
    component.find('[testID="headerEvents"]').prop('onLinkPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const data = {
      full_name: 'John doe',
      email: 'john@gmail.com',
      country_code: '+91',
      phone_number: '9876543210',
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };
    mapDispatchToProps(dispatch).loginSuccess(data);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_SUCCESS,
      payload: data,
    });
  });

  it('should fetch the social media data', async () => {
    jest.spyOn(CommonRepository, 'getSocialMedia').mockImplementation(() => Promise.resolve(SocialMediaData));
    await instance.componentDidMount();
    const response = await CommonRepository.getSocialMedia();
    component.setState({ socialMediaProviders: response });
    expect(component.state('socialMediaProviders')).toStrictEqual(SocialMediaData);
  });

  it('should handle signup form submit', () => {
    const formData = {
      full_name: 'John doe',
      email: 'john@gmail.com',
      country_code: '+91',
      phone_number: '9876543210',
      password: 'password',
    };
    component.setState({ isNewUser: true });
    // @ts-ignore
    component.find('[testID="signupForm"]').prop('onSubmitFormSuccess')(formData);
    expect(mock).toHaveBeenCalled();
  });
});
