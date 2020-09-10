import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Portfolio } from '@homzhub/mobile/src/screens/Asset/Portfolio';
import { PortfolioAssetData, TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';
import { DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';

const mock = jest.fn();

describe.skip('Portfolio Screen', () => {
  let component: any;
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
    component.instance().renderList(TenanciesAssetData[0], 0, DataType.TENANCIES);
    component.instance().handleExpandCollapse(1, DataType.TENANCIES);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for properties', () => {
    component.setState({ portfolioProperties: PortfolioAssetData });
    component.instance().onViewProperty();
    component.instance().onSelectFilter(Filters.ALL);
    expect(toJson(component)).toMatchSnapshot();
  });
});
