import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

describe('Property Actions', () => {
  it('should call get property detail action', () => {
    const action = PropertyActions.getPropertyDetails();
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.PROPERTY_DETAILS,
    });
  });

  it('should call get property success action', () => {
    const action = PropertyActions.getPropertyDetailsSuccess(PropertyAssetGroupData);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.PROPERTY_DETAILS_SUCCESS,
      payload: PropertyAssetGroupData,
    });
  });

  it('should call get property failure action', () => {
    const action = PropertyActions.getPropertyDetailsFailure('Test Error');
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE,
      error: 'Test Error',
    });
  });
});
