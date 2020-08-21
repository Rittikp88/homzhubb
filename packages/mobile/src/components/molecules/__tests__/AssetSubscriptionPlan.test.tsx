import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetSubscriptionPlan } from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';

let props: any;

describe('AssetSubscriptionPlan', () => {
  const createTestProps = (testProps: any): object => ({
    data: [
      {
        id: 1,
        name: 'test',
      },
    ],
    planName: '',
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<AssetSubscriptionPlan {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    const wrapper = shallow(<AssetSubscriptionPlan {...props} />);
    const RenderItem = wrapper.find('[testID="subscriptionList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    const wrapper = shallow(<AssetSubscriptionPlan {...props} />);
    const KeyExtractor = wrapper.find('[testID="subscriptionList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={props.data[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
