import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';

const mock = jest.fn();

describe('Reset Password Screen', () => {
  let component: ShallowWrapper;
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
        <ResetPassword {...props} />
      </I18nextProvider>
    );
  });

  it('should render reset password screen', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });
});
