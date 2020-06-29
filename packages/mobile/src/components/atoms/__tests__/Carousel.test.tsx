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
      activeSlide: 0,
      carouselItem: OnboardingData[0],
      bubbleRef: mock,
      currentSlide: mock,
      testID: 'carsl',
    });
    component = shallow(<SnapCarousel {...props} />);
  });

  afterEach(() => jest.clearAllMocks());

  it('should match snapshot', () => {
    props = createTestProps({
      carouselData: OnboardingData,
      activeSlide: 0,
      carouselItem: mock,
      bubbleRef: mock,
      currentSlide: mock,
      testID: 'carsl',
    });
    component = shallow(<SnapCarousel {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should update the current slide', () => {
    // @ts-ignore
    component.dive().find('[testID="carsl"]').prop('onSnapToItem')();
    expect(mock).toHaveBeenCalled();
  });

  it('should not call the bubbleref', () => {
    // @ts-ignore
    props = createTestProps({
      carouselData: OnboardingData,
      activeSlide: 0,
      carouselItem: OnboardingData[0],
      currentSlide: mock,
      testID: 'carsl',
    });
    const wrapper = shallow(<SnapCarousel {...props} />);
    // @ts-ignore
    wrapper.dive().find('[testID="carsl"]').prop('onLayout')();
    expect(mock).toBeCalledTimes(0);
  });
});
