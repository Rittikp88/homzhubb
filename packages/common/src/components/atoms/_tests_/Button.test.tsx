import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button } from '@homzhub/common/src/components/atoms/Button';

describe('Button', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Button onPress={jest.fn} type="primary" title="Test" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for secondary button', () => {
    const wrapper = shallow(<Button onPress={jest.fn} type="secondary" title="Test" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for disabled', () => {
    const wrapper = shallow(<Button onPress={jest.fn} type="secondary" disabled title="Test" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
