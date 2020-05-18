import React from 'react';
import renderer from 'react-test-renderer';
import { SignUpForm } from '@homzhub/common/src/components';

describe('Test cases for SignUpForm', () => {
  it('should render snapshot', () => {
    // @ts-ignore
    const tree = renderer.create(<SignUpForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
