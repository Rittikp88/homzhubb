import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import { AssetMetricsData } from '@homzhub/common/src/mocks/AssetMetrics';

let props: any;
let wrapper: ShallowWrapper;

describe('AssetMetricsList', () => {
  const createTestProps = (testProps: any): object => ({
    data: AssetMetricsData.asset_metrics.miscellaneous,
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<AssetMetricsList {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for optional props', () => {
    props = createTestProps({
      subscription: 'subscribe',
      showPlusIcon: true,
    });
    wrapper = shallow(<AssetMetricsList {...props} />);
    // @ts-ignore
    wrapper.find('[testID="icnPlus"]').prop('onPress')();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function on plus click', () => {
    props = createTestProps({
      subscription: 'subscribe',
      showPlusIcon: true,
      onPlusIconClicked: jest.fn(),
    });
    wrapper = shallow(<AssetMetricsList {...props} />);
    // @ts-ignore
    wrapper.find('[testID="icnPlus"]').prop('onPress')();
    expect(props.onPlusIconClicked).toBeCalled();
  });

  it('should match snapshot for renderItem', () => {
    wrapper = shallow(<AssetMetricsList {...props} />);
    const RenderItem = wrapper.find('[testID="metricList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    wrapper = shallow(<AssetMetricsList {...props} />);
    const KeyExtractor = wrapper.find('[testID="metricList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={props.data[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
