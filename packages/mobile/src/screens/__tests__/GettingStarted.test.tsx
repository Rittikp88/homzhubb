import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';

jest.mock('@homzhub/common/src/components/atoms/Text', () => 'Text');
jest.mock('@homzhub/common/src/components/atoms/Text', () => 'Label');
jest.mock('@homzhub/common/src/components/atoms/Button', () => 'Button');

describe('Getting started Screen', () => {
  it('should click getting started button', () => {
    const wrapper: ShallowWrapper = shallow(<GettingStarted />);
    expect(toJson(wrapper.dive())).toMatchSnapshot();
  });
});
