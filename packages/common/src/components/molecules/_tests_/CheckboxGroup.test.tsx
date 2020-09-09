import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CheckboxGroup, IProps } from '@homzhub/common/src/components/molecules/CheckboxGroup';

const mock = jest.fn();
const data = [
  {
    id: 1,
    label: 'Label 1',
    isSelected: true,
  },
  {
    id: 2,
    label: 'Label 2',
    isSelected: false,
  },
];
describe('CheckboxGroup', () => {
  let wrapper: any;
  let props: IProps;

  it('should match snapshot', () => {
    props = {
      data,
      onToggle: mock,
    };
    wrapper = shallow(<CheckboxGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for numColumns', () => {
    props = {
      data,
      onToggle: mock,
      numColumns: 2,
    };
    wrapper = shallow(<CheckboxGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render checkbox', () => {
    props = {
      data,
      onToggle: mock,
      numColumns: 2,
      testID: 'checkbox',
    };
    wrapper = shallow(<CheckboxGroup {...props} />);
    const RenderItem = wrapper.find('[testID="ftlist"]').prop('renderItem');
    const renderItemShallowWrapper = shallow(<RenderItem item={data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should render checkbox without num columns value', () => {
    props = {
      data,
      onToggle: mock,
      testID: 'checkbox',
    };
    wrapper = shallow(<CheckboxGroup {...props} />);
    const RenderItem = wrapper.find('[testID="ftlist"]').prop('renderItem');
    const renderItemShallowWrapper = shallow(<RenderItem item={data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });
});
