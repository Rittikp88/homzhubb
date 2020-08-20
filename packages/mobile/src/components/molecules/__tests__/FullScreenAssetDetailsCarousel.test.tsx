// @ts-noCheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FullScreenAssetDetailsCarousel } from '../FullScreenAssetDetailsCarousel';

let props: any;

describe('FullScreenAssetDetailsCarousel', () => {
  const createTestProps = (testProps: any): object => ({
    activeSlide: 0,
    data: [
      {
        file_name: 'prof.jpg',
        is_cover_image: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
    ],
    onFullScreenToggle: jest.fn(),
    updateSlide: jest.fn(),
    onShare: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    const e = {
      nativeEvent: {
        contentOffset: {
          x: 0,
          y: 0,
        },
      },
    };
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    wrapper.find('[testID="attachmentFlatList"]').prop('onMomentumScrollEnd')(e);
    expect(props.updateSlide).toBeCalled();
  });
});
