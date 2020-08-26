import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { GeneralLedgersData } from '@homzhub/common/src/mocks/GeneralLedgers';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

const createTestProps = (testProps: any): object => ({
  data: ObjectMapper.deserializeArray(GeneralLedgers, GeneralLedgersData),
  ...testProps,
});
let props: any;

describe('DonutGraph', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<DonutGraph {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
