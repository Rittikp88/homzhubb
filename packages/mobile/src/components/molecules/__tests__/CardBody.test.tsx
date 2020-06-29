import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';

describe('CardBody', () => {
  it('should match snapshot', () => {
    const props = {
      title: 'card',
      description: 'card body',
      serviceCost: 'Free',
      isDetailView: true,
      badgeTitle: 'label',
      detailedData: ServicesData[0].service_items,
    };
    const wrapper = mount(<CardBody {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
