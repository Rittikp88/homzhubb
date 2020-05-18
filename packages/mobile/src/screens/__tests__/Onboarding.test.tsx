import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Onboarding, { mapDispatchToProps } from '@homzhub/mobile/src/screens/OnBoarding';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import toJson from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';

const createTestProps = (testProps: object): any => ({
  ...testProps,
});
const mock = jest.fn();
const mockStore = configureStore([]);

jest.mock('@homzhub/mobile/src/components/atoms/Carousel', () => 'SnapCarousel');
jest.mock('@homzhub/common/src/components/atoms/Text', () => 'Text');
jest.mock('@homzhub/common/src/components/atoms/Text', () => 'Label');
jest.mock('@homzhub/common/src/components/atoms/Button', () => 'Button');

describe('Onboarding Screen', () => {
  let store;
  let component;
  let props;
  const OnboardingDataExample = {
    data: OnboardingData,
  };

  beforeEach(() => {
    store = mockStore({
      onboarding: OnboardingDataExample,
    });
    props = createTestProps({
      onboarding: OnboardingDataExample,
      activeSlide: 0,
      ref: {},
      getOnboardingDetail: mock,
      navigation: {},
    });
    component = shallow(
      <Provider store={store}>
        <Onboarding {...props} />
      </Provider>
    );
  });

  it('should match snapshot', () => {
    expect(toJson(component.dive())).toMatchSnapshot();
  });

  it('should match snapshot 1', () => {
    const mountedComponent = mount(
      <Provider store={store}>
        <Onboarding {...props} />
      </Provider>
    );
    expect(toJson(mountedComponent)).toMatchSnapshot();
  });

  it('should dispatch actions', () => {
    mapDispatchToProps(mock).getOnboardingDetail();
  });
});
