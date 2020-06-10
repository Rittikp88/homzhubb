import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNSlider } from '@homzhub/common/src/components/atoms/Slider';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';

describe('Slider', () => {
  const props = {
    sliderStyle: { borderWidth: 2, transform: [{ scaleX: 2 }, { scaleY: 2 }] },
    minimumValue: 0,
    maximumValue: 1,
    minimumTrackTintColor: theme.colors.primaryColor,
    maximumTrackTintColor: theme.colors.disabled,
    value: 0.5,
    thumbTintColor: theme.colors.primaryColor,
    thumbImage: images.round,
    onValueChange: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<RNSlider {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
