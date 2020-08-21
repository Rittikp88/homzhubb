import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetAdvertisementBanner } from '@homzhub/mobile/src/components/molecules/AssetAdvertisementBanner';

describe('AssetDetailsImageCarousel', () => {
  const data = [
    {
      img_url: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
    },
  ];

  it('should match snapshot', () => {
    const wrapper = shallow(<AssetAdvertisementBanner />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for carouselItem', () => {
    const wrapper = shallow(<AssetAdvertisementBanner />);
    const RenderItem = wrapper.find('[testID="bannerSnap"]').prop('carouselItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    const wrapper = shallow(<AssetAdvertisementBanner />);
    // @ts-ignore
    wrapper.find('[testID="bannerSnap"]').prop('onSnapToItem')(1);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot without banners', () => {
    const wrapper = shallow(<AssetAdvertisementBanner />);
    wrapper.setState({ banners: [] });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
