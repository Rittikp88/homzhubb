import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { ServiceDetailScreen, mapStateToProps } from '@homzhub/mobile/src/screens/Asset/Record/ServiceDetailScreen';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

const mock = jest.fn();
describe('Service Detail Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      services: ServicesData,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <ServiceDetailScreen
        {...props}
        t={(key: string): string => key}
        route={{ params: { serviceId: 1 }, isExact: true, path: '', url: '' }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for continue', () => {
    component.instance().onPressContinue('test', 1);
    component.instance().handleMoreInfo('More Info');
    component.instance().onConfirmService();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previous screen', () => {
    component.find('[testID="animatedServiceList"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should change slide number for carosuel', () => {
    component.setState({ activeSlide: 0 });
    component.find('[testID="carsl"]').prop('onSnapToItem')(1);
    expect(component.state('activeSlide')).toBe(1);
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        servicesInfo: ServicesData,
      },
      search: {
        ...initialSearchState,
      },
      asset: {
        ...initialAssetState,
      },
      portfolio: {
        ...initialPortfolioState,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.services).toStrictEqual(ServicesData);
  });
});
