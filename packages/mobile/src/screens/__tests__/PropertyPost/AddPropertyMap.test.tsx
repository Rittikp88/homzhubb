// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import {
  AddPropertyMap,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/PropertyPost/AddPropertyMap';

const mock = jest.fn();

describe('Add property Map Screen Component', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      setCurrentPropertyId: mock,
      propertyId: 1,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <AddPropertyMap
        {...props}
        t={(key: string): string => key}
        route={{
          params: { initialLatitude: 1, initialLongitude: 1, primaryTitle: 'location', secondaryTitle: 'location2' },
        }}
      />
    );
  });
  it('should render property details screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for states', () => {
    component.instance().onPressSetLocation();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to previous screen', () => {
    component.instance().onClose();
    component.find('[testID="location"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should return property id', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        currentPropertyId: 1,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.propertyId).toBe(1);
  });

  it('should dispatch setCurrentPropertyId', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).setCurrentPropertyId(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: PropertyActionTypes.SET.CURRENT_PROPERTY_ID,
      payload: 1,
    });
  });
});
