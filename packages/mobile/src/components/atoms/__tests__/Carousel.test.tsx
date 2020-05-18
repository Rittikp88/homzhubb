import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

const createTestProps = (testProps: any): object => ({
  ...testProps,
});
let props: any;
const mockBubbleRef = jest.fn();
const mockCurrentSlide = jest.fn();

describe('Carousel', () => {
  it('should match snapshot', () => {
    props = createTestProps({
      carouselItems: OnboardingData,
      activeSlide: 0,
      showPagination: true,
      bubbleRef: mockBubbleRef,
      currentSlide: mockCurrentSlide,
    });
    const wrapper = shallow(<SnapCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
