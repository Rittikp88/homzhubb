// @ts-noCheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyListImageCarousel } from '@homzhub/mobile/src/components/molecules/PropertyListImageCarousel';

let props: any;

describe('PropertyListImageCarousel', () => {
  const createTestProps = (testProps: any): object => ({
    images: [
      {
        file_name: 'prof.jpg',
        is_cover_image: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
    ],
    isFavorite: false,
    onFavorite: jest.fn(),
    isCarousel: false,
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<PropertyListImageCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with props', () => {
    props = createTestProps({
      isFavorite: true,
      isCarousel: true,
    });
    const wrapper = shallow(<PropertyListImageCarousel {...props} />);
    wrapper.find('[testID="snapCarousel"]').prop('onSnapToItem')();
    wrapper.find('[testID="snapCarousel"]').prop('bubbleRef')();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
