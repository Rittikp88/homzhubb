import React from 'react';
import renderer from 'react-test-renderer';
import { TermsCondition } from '@homzhub/common/src/components';

describe('Test cases for TermsAndCondition', () => {
  it('should render snapshot', () => {
    const tree = renderer.create(<TermsCondition />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
