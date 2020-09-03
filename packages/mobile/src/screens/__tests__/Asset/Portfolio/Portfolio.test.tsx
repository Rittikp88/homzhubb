// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Portfolio } from '@homzhub/mobile/src/screens/Asset/Portfolio';
import { PortfolioAssetData, TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';

const mock = jest.fn();

describe('Portfolio Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<Portfolio {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    component.instance().updateFilter();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for isFullScreenView', () => {
    component.instance().onFullScreenToggle();
    component.instance().updateSlide(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for tenancies', () => {
    component.setState({ tenancies: TenanciesAssetData });
    component.instance().renderList(TenanciesAssetData[0]);
    component.instance().handleExpandCollapse(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for properties', () => {
    component.setState({ portfolioProperties: PortfolioAssetData });
    component.instance().onViewProperty();
    component.instance().onSelectFilter('ALL');
    expect(toJson(component)).toMatchSnapshot();
  });
});
