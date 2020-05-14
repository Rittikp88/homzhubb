import React from 'react';
import renderer from 'react-test-renderer';
import { FormField } from '@homzhub/common/src/components/molecules/FormField';

describe('Test cases for FormField', () => {
  const formValues = {
    values: {
      name: 'test',
    },
    touched: {
      name: 'test',
    },
  };

  it('should render snapshot', () => {
    const props = {
      label: '',
      name: '',
      children: null,
      formProps: formValues,
    };

    // @ts-ignore
    const tree = renderer.create(<FormField {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when isOptional is true', () => {
    const props = {
      isOptional: true,
      formProps: formValues,
    };
    // @ts-ignore
    const tree = renderer.create(<FormField {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
