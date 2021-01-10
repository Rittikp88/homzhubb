import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';

const mock = jest.fn();
jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(),
  };
});

const PropertyImagesByPropertyId = [
  {
    id: 68,
    description: '',
    is_cover_image: true,
    asset: 140,
    attachment: 197,
    link:
      'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_imgages/c8f726a0-b45f-11ea-a48b-0242ac110003d80b957b-bb07-4dbe-8873-faf081cc7c20.jpg',
  },
  {
    id: 69,
    description: '',
    is_cover_image: false,
    asset: 141,
    attachment: 198,
    link:
      'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_imgages/c8f726a0-b45f-11ea-a48b-0242ac110003d80b957b-bb07-4dbe-8873-faf081cc7c20.jpg',
  },
];

describe('Property Images Component', () => {
  let component: ShallowWrapper;
  let props: any;
  let instance: any;

  beforeEach(() => {
    props = {
      propertyId: 1,
      updateStep: mock,
      setLoading: mock,
    };
    component = shallow(<PropertyImages {...props} t={(key: string): string => key} />).dive();
    instance = component.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the PropertyImages component', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fetch the property images by id', async () => {
    jest
      .spyOn(AssetRepository, 'getPropertyImagesByPropertyId')
      // @ts-ignore
      .mockImplementation(async () => Promise.resolve(PropertyImagesByPropertyId));
    await instance.componentDidMount();
    const response = await AssetRepository.getPropertyImagesByPropertyId(1);
    instance.setState({ selectedImages: response });
    expect(component.state('selectedImages')).toStrictEqual(PropertyImagesByPropertyId);
  });

  it('should fetch empty data from the property images by id', async () => {
    jest.spyOn(AssetRepository, 'getPropertyImagesByPropertyId').mockImplementation(async () => Promise.resolve([]));
    await instance.componentDidMount();
    const response = await AssetRepository.getPropertyImagesByPropertyId(1);
    instance.setState({ selectedImages: response });
    expect(component.state('selectedImages')).toStrictEqual([]);
  });
});
