import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetSubscriptionPlanData } from '@homzhub/common/src/mocks/AssetMetrics';
import { AssetSubscriptionPlan } from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';

describe('AssetSubscriptionPlan', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    const props = {};
    // @ts-ignore
    wrapper = shallow(<AssetSubscriptionPlan {...props} t={(key: string): string => key} />);
    wrapper.setState({ data: AssetSubscriptionPlanData });
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    const RenderItem = wrapper.find('[testID="subscriptionList"]').prop('renderItem');
    const renderItemShallowWrapper = shallow(
      // @ts-ignore
      <RenderItem item={AssetSubscriptionPlanData.recommended_plan.service_plan_bundles[0]} />
    );
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    const KeyExtractor = wrapper.find('[testID="subscriptionList"]').prop('keyExtractor');
    const renderExtractorShallowWrapper = shallow(
      // @ts-ignore
      <KeyExtractor item={AssetSubscriptionPlanData.recommended_plan.service_plan_bundles[0]} />
    );
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
