import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';

const createTestProps = (testProps: object): any => ({
  ...testProps,
});

const mockStore = configureStore([]);
const mock = jest.fn();

describe('Onboarding Screen', () => {
  let store: any;
  let component: any;
  let props: any;

  beforeEach(async () => {
    store = mockStore();
    props = createTestProps({
      data: OnboardingData,
      activeSlide: 0,
      ref: {},
      getOnboardingDetail: mock,
      navigation: { navigate: mock },
    });
    await I18nService.init();
    component = mount(
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
    expect(toJson(component)).toMatchSnapshot();
  });
});
