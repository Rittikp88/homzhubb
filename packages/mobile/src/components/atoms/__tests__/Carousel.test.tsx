import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

const createTestProps = (testProps: any): object => ({
  ...testProps,
});
const mock = jest.fn();

describe('Carousel Atom', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = createTestProps({
      carouselData: OnboardingData,
      activeIndex: 0,
      carouselItem: OnboardingData[0],
      bubbleRef: mock,
      onSnapItem: mock,
      testID: 'carsl',
    });
    component = shallow(<SnapCarousel {...props} />);
  });

  afterEach(() => jest.clearAllMocks());

  it('should match snapshot', () => {
    props = createTestProps({
      carouselData: OnboardingData,
      activeIndex: 0,
      carouselItem: mock,
      bubbleRef: mock,
      onSnapItem: mock,
      testID: 'carsl',
    });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should not call the bubbleref', () => {
    // @ts-ignore
    props = createTestProps({
      carouselData: OnboardingData,
      activeIndex: 0,
      carouselItem: OnboardingData[0],
      onSnapItem: mock,
      testID: 'carsl',
    });
    const wrapper = shallow(<SnapCarousel {...props} />);
    // @ts-ignore
    wrapper.dive().find('[testID="carsl"]').prop('onLayout')();
    expect(mock).toBeCalledTimes(0);
  });
});
