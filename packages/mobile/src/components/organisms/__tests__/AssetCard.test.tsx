import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetCard } from '@homzhub/mobile/src/components/organisms/AssetCard';
import { TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';

let props: any;
let wrapper: ShallowWrapper;

describe('AssetCard', () => {
  const createTestProps = (testProps: any): object => ({
    assetData: TenanciesAssetData,
    onViewProperty: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<AssetCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for expanded view', () => {
    wrapper = shallow(<AssetCard {...props} />);
    // @ts-ignore
    wrapper.find('[testID="collapseIcon"]').prop('onPress')();
    expect(toJson(wrapper)).toMatchSnapshot();
    // @ts-ignore
    wrapper.find('[testID="btnPropertyView"]').prop('onPress')();
    expect(props.onViewProperty).toBeCalled();
  });

  it('should match snapshot for detail view', () => {
    props = createTestProps({
      isDetailView: true,
    });
    wrapper = shallow(<AssetCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
