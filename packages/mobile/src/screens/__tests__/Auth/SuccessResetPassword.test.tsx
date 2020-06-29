import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SuccessResetPassword } from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';

const mock = jest.fn();
describe('Success Password Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<SuccessResetPassword {...props} t={(key: string): string => key} />);
  });

  it('should render success reset password screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to login screen', () => {
    // @ts-ignore
    component.find('[testID="btnLogin"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
