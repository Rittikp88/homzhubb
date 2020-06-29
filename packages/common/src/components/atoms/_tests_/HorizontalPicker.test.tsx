import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HorizontalPicker, Item, ItemToRender } from '@homzhub/common/src/components/atoms/HorizontalPicker';

describe('HorizontalPicker', () => {
  const props = {
    value: 0,
    onValueChange: jest.fn(),
  };
  const wrapper = shallow(<HorizontalPicker {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('Item to Render', () => {
  const item = {
    item: 0,
    index: 0,
  };
  const wrapper: ShallowWrapper = shallow(<ItemToRender {...item} index={0} />);
  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('Item', () => {
  it('should match snapshot when selected is false', () => {
    const props = {
      opacity: 0,
      selected: false,
      value: '',
    };
    const wrapper: ShallowWrapper = shallow(<Item {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when selected is true', () => {
    const props = {
      opacity: 0,
      selected: true,
      value: '',
    };
    const wrapper: ShallowWrapper = shallow(<Item {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
