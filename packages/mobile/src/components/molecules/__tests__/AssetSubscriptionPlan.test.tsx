import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSubscriptionPlan } from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { AssetSubscriptionPlanData } from '@homzhub/common/src/mocks/AssetMetrics';

describe('AssetSubscriptionPlan', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    const props = {};
    // @ts-ignore
    wrapper = shallow(<AssetSubscriptionPlan {...props} t={(key: string): string => key} />);
    wrapper.setState({ data: ObjectMapper.deserialize(UserSubscription, AssetSubscriptionPlanData) });
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
