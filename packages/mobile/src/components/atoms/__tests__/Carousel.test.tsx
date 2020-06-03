import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

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
    const wrapper: ShallowWrapper = shallow(<SnapCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
