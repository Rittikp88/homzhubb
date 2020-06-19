import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

jest.mock('@homzhub/common/src/components/', () => 'Text');
jest.mock('@homzhub/common/src/components/', () => 'Label');

describe('Item Group Component', () => {
  it('should render item group label', () => {
    const props = {
      data: PropertyAssetGroupData,
      onItemSelect: jest.fn(),
      selectedIndex: 0,
      textType: 'label',
      title: 'Item Group',
    };
    // @ts-ignore
    const component = shallow(<ButtonGroup {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render item group text', () => {
    const props = {
      data: PropertyAssetGroupData,
      onItemSelect: jest.fn(),
      selectedIndex: 0,
      textType: 'text',
      superTitle: 'Property type',
      title: 'Item Group',
    };
    // @ts-ignore
    const component = shallow(<ButtonGroup {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
