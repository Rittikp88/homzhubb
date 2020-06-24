import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';

const createTestProps = (testProps: any): object => ({
  title: 'card',
  description: 'card body',
  serviceCost: 'Free',
  isDetailView: true,
  badgeTitle: 'label',
  detailedData: ServicesData[0].service_items,
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
