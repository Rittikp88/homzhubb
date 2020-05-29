import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';

jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/common/src/components/', () => 'Label');
jest.mock('@homzhub/common/src/components/', () => 'Button');
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

describe('Getting started Screen', () => {
  let component: any;
  let props: any;
  beforeEach(async () => {
    props = {};
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <GettingStarted {...props} />
      </I18nextProvider>
    );
  });

  it('should render the getting started screen', () => {
    expect(toJson(component.dive().dive())).toMatchSnapshot();
  });
});
