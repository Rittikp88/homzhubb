import { initialPropertyState, propertyReducer as reducer } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

describe('Property Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INITIAL_STATE' })).toEqual(initialPropertyState);
  });

  it('should handle Get Property details', () => {
    const state = reducer(initialPropertyState, PropertyActions.getPropertyDetails());
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['loaders']: { ...state.loaders, ['property']: true },
      ['error']: { ...state.error, ['property']: '' },
    });
  });

  it('should handle Get Property details Success', () => {
    const state = reducer(initialPropertyState, PropertyActions.getPropertyDetailsSuccess(PropertyAssetGroupData));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['propertyDetails']: {
        ...state.propertyDetails,
        ['propertyGroup']: PropertyAssetGroupData,
      },
      ['loaders']: { ...state.loaders, ['property']: false },
    });
  });

  it('should handle Get property failure', () => {
    const state = reducer(initialPropertyState, PropertyActions.getPropertyDetailsFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['loaders']: { ...state.loaders, ['property']: false },
      ['error']: { ...state.error, ['property']: 'Test Error' },
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INITIAL_STATE' })).toEqual(initialPropertyState);
  });

  it('should handle set current property id', () => {
    const state = reducer(initialPropertyState, PropertyActions.setCurrentPropertyId(1));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['currentPropertyId']: 1,
    });
  });

  it('should handle set current lease term id', () => {
    const state = reducer(initialPropertyState, PropertyActions.setTermId(1));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['termId']: 1,
    });
  });
});
