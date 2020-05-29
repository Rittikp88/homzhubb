import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@homzhub/common/src/components/', () => 'Header');
jest.mock('@homzhub/common/src/components/', () => 'Button');

describe('Success Password Screen', () => {
  let component: any;
  let props: any;

  beforeEach(async () => {
    props = {};
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
});
