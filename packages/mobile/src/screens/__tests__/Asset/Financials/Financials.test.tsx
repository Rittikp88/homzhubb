// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Financials } from '@homzhub/mobile/src/screens/Asset/Financials';

describe('Financials Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<Financials t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
