import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ResetPassword } from '@homzhub/mobile/src/screens/Auth/ResetPassword';

const mock = jest.fn();

describe('Reset Password Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<ResetPassword {...props} t={(key: string): string => key} />);
  });

  it('should render reset password screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate on icon press', () => {
    // @ts-ignore
    component.find('[testID="headerIconPress"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });
});
