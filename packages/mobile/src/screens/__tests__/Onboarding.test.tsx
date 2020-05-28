import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';

const createTestProps = (testProps: object): any => ({
  ...testProps,
});

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin');
jest.mock('@homzhub/mobile/src/components/atoms/Carousel', () => 'SnapCarousel');
jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/common/src/components/', () => 'Label');
jest.mock('@homzhub/common/src/components/', () => 'Button');

const mockStore = configureStore([]);
const mock = jest.fn();

describe('Onboarding Screen', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore({
      onBoarding: {
        data: OnboardingData,
      },
    });
    props = createTestProps({
      data: OnboardingData,
      activeSlide: 0,
      ref: {},
      getOnboardingDetail: mock,
      navigation: { navigate: jest.fn() },
    });
    await I18nService.init();
    component = TestRenderer.create(
      <Provider store={store}>
        <I18nextProvider i18n={I18nService.instance}>
          <OnBoarding {...props} />
        </I18nextProvider>
      </Provider>
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should match snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
