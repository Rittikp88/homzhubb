import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { AutocompleteMock } from '@homzhub/common/src/mocks/GooglePlacesMocks';

let props: any;
let wrapper: ShallowWrapper;

describe('SearchResults', () => {
  const createTestProps = (testProps: any): object => ({
    results: AutocompleteMock.predictions,
    onResultPress: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="resultList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.results[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should call result press function', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="resultList"]').prop('renderItem');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<RenderItem item={props.results[0]} />);
    // @ts-ignore
    renderExtractorShallowWrapper.find('[testID="pressResult"]').prop('onPress')();
    expect(props.onResultPress).toBeCalled();
  });

  it('should match snapshot for keyExtractor', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    const KeyExtractor = wrapper.find('[testID="resultList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={props.results[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for list header', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="resultList"]').prop('ListHeaderComponent');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });
});
