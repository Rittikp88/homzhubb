// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MarketTrends } from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';

describe('Market Trends Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<MarketTrends t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
