import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SocialMediaKeys } from '@homzhub/common/src/assets/constants';
import { DetailedHeader } from '@homzhub/common/src/components';
import { MobileVerificationScreen } from '@homzhub/mobile/src/screens/Auth/MobileVerificationScreen';

const mock = jest.fn();

describe('Mobile verification Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <MobileVerificationScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            isFromLogin: true,
            provider: SocialMediaKeys.Google,
            userData: {
              user: {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@yopmail.com',
              },
            },
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot when its not from login', () => {
    component = shallow(
      <MobileVerificationScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            isFromLogin: false,
            userData: {
              provider: SocialMediaKeys.Google,
              user: {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@yopmail.com',
              },
            },
            onCallback: mock,
          },
        }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate back', () => {
    component.find(DetailedHeader).prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });
});
