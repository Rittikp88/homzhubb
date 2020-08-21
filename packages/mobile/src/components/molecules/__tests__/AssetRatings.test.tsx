import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetRatings } from '@homzhub/mobile/src/components/molecules/AssetRatings';
import { mockReviews } from '@homzhub/common/src/mocks/AssetDescription';

let props: any;

describe('AssetRatings', () => {
  const createTestProps = (testProps: any): object => ({
    reviews: mockReviews,
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<AssetRatings {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    const wrapper = shallow(<AssetRatings {...props} />);
    const RenderItem = wrapper.find('[testID="reviewsList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={mockReviews[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem when rating less than 50', () => {
    const wrapper = shallow(<AssetRatings {...props} />);
    const RenderItem = wrapper.find('[testID="reviewsList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={mockReviews[2]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    const wrapper = shallow(<AssetRatings {...props} />);
    const KeyExtractor = wrapper.find('[testID="reviewsList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={mockReviews[2]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
