import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { More } from '@homzhub/mobile/src/screens/Asset/More';
import { MORE_SCREENS } from '@homzhub/common/src/constants/MoreScreens';

describe('Financials Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      logout: jest.fn(),
    };
    component = shallow(<More {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    const RenderItem = component.find('[testID="moreList"]').at(0).prop('renderItem');
    const renderItemShallowWrapper = shallow(<RenderItem item={MORE_SCREENS.sectionA[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderSeparator', () => {
    const RenderItem = component.find('[testID="moreList"]').at(0).prop('ItemSeparatorComponent');
    const renderItemShallowWrapper = shallow(<RenderItem />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    const KeyExtractor = component.find('[testID="moreList"]').at(0).prop('keyExtractor');
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={MORE_SCREENS.sectionA[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
