import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DocumentCard } from '@homzhub/mobile/src/components/molecules/DocumentCard';

describe('DocumentCard', () => {
  it('should match snapshot', () => {
    const props = {
      document: {},
      handleShare: jest.fn(),
    };
    const wrapper = mount(<DocumentCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
