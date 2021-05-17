import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddRecordScreen } from '@homzhub/mobile/src/screens/Asset/Financials/AddRecordScreen';

describe('Add Record Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      route: {
        params: {
          assetId: 1,
        },
      },
    };
    component = shallow(<AddRecordScreen {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
