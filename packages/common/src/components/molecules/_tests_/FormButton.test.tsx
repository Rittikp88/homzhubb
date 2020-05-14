import React from 'react';
import renderer from 'react-test-renderer';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';

describe('Test cases for FormButton', () => {
  it('should render snapshot', () => {
    const props = {
      type: 'primary',
    };

    // @ts-ignore
    const tree = renderer.create(<FormButton {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
