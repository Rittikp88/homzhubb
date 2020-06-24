import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';

const mock = jest.fn();
describe('Success Password Screen', () => {
  let component: any;
  let props: any;

  beforeEach(async () => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <SuccessResetPassword {...props} />
      </I18nextProvider>
    );
  });

  it('should render success reset password screen', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });

  it('should navigate to login screen', () => {
    component.dive().dive().dive().find('[testID="login"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
