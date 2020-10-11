import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BookVisit } from '@homzhub/mobile/src/screens/Asset/Search/BookVisit';

describe.skip('Book Visit Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
        navigate: jest.fn(),
      },
      isLoggedIn: true,
    };
    component = shallow(<BookVisit {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with upcoming visits', () => {
    component.setState({ upcomingVisits: [{}] });
    expect(toJson(component)).toMatchSnapshot();
  });
});
