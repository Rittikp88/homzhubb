import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyDetailScreen } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetailScreen';
import { TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';

describe('Property Detail Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      route: {
        params: {
          propertyData: TenanciesAssetData[0],
        },
      },
    };
    component = shallow(<PropertyDetailScreen {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render tabs', () => {
    // @ts-ignore
    component.instance().renderTabs('name', 1, true);
    // @ts-ignore
    component.instance().renderTabs('name', 1, false);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call goBack', () => {
    // @ts-ignore
    component.find('[testID="icnBack"]').prop('onPress')();
    expect(props.navigation.goBack).toBeCalled();
  });
});
