import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PendingPropertyListCard } from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';

let props: any;
let wrapper: ShallowWrapper;

describe('PendingPropertyListCard', () => {
  wrapper = shallow(<PendingPropertyListCard {...props} t={(key: string): string => key} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should increase the current index', () => {
    // @ts-ignore
    wrapper.find('[testID="icnNext"]').prop('onPress')();
    // @ts-ignore
    expect(wrapper.instance().state.currentPropertyIndex).toBe(1);
  });

  it('should increase the current index', () => {
    // @ts-ignore
    wrapper.find('[testID="icnPrevious"]').prop('onPress')();
    // @ts-ignore
    expect(wrapper.instance().state.currentPropertyIndex).toBe(0);
  });
});
