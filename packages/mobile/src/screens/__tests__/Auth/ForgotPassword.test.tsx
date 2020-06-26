import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import ForgotPassword from '@homzhub/mobile/src/screens/Auth/ForgotPassword';
import { DetailedHeader } from '@homzhub/common/src/components';

const mock = jest.fn();

describe('Forgot Password Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(async () => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <ForgotPassword {...props} />
      </I18nextProvider>
    ) as any;
  });

  it('should render forgot password screen', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });

  it('should navigate to login screen', () => {
    // @ts-ignore
    component.dive().dive().dive().find('[testID="txtLogin"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate back', () => {
    // @ts-ignore
    component.dive().dive().dive().find(DetailedHeader).prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });
});
