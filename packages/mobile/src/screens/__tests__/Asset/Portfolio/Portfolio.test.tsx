// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Portfolio } from '@homzhub/mobile/src/screens/Asset/Portfolio';
import { TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';

describe('Portfolio Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<Portfolio />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for functions', () => {
    component.instance().renderList(TenanciesAssetData[0]);
    component.instance().onSelectFilter('rent');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for state', () => {
    component.find('[testID="menu"]').prop('onPress')();
    expect(toJson(component)).toMatchSnapshot();
  });
});
