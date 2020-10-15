import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PendingPropertyListCard } from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';

let props: any;
let wrapper: ShallowWrapper;

describe('PendingPropertyListCard', () => {
  wrapper = shallow(<PendingPropertyListCard {...props} t={(key: string): string => key} />);
  wrapper.setState({ data: [mockAsset] });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
