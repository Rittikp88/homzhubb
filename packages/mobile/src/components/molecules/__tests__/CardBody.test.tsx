import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const createTestProps = (testProps: any): object => ({
  title: 'card',
  description: 'card body',
  serviceCost: 'Free',
  isDetailView: true,
  badgeTitle: 'label',
  detailedData: ServicesData[0].facilities,
  ...testProps,
});
let props: any;

describe('CardBody', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<CardBody {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
