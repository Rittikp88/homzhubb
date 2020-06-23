import { propertyReducer as reducer, initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';

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

  it('should handle Get Service details', () => {
    // @ts-ignore
    const state = reducer(initialPropertyState, PropertyActions.getServiceDetails());
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['loaders']: { ...state.loaders, ['service']: true },
      ['error']: { ...state.error, ['service']: '' },
    });
  });

  it('should handle Get Service failure', () => {
    const state = reducer(initialPropertyState, PropertyActions.getServiceDetailsFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['loaders']: { ...state.loaders, ['service']: false },
      ['error']: { ...state.error, ['service']: 'Test Error' },
    });
  });

  it('should handle Get Rent Service list Success', () => {
    const state = reducer(initialPropertyState, PropertyActions.getRentServiceListSuccess(RentServicesData));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['propertyDetails']: {
        ...state.propertyDetails,
        ['rentServices']: RentServicesData,
      },
      ['loaders']: { ...state.loaders, ['property']: false },
    });
  });

  it('should handle Get Service detail Success', () => {
    const state = reducer(initialPropertyState, PropertyActions.getServiceDetailsSuccess(ServicesData));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['servicesInfo']: ServicesData,
      ['loaders']: { ...state.loaders, ['service']: false },
    });
  });

  it('should handle Get Service steps Success', () => {
    const state = reducer(initialPropertyState, PropertyActions.getServiceStepsDetailsSuccess(ServiceSteps));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['servicesSteps']: ServiceSteps,
      ['loaders']: { ...state.loaders, ['service']: false },
    });
  });

  it('should handle set current property id', () => {
    const state = reducer(initialPropertyState, PropertyActions.setCurrentPropertyId(1));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['currentPropertyId']: 1,
    });
  });

  it('should handle set current lease term id', () => {
    const state = reducer(initialPropertyState, PropertyActions.setCurrentLeaseTermId(1));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['currentLeaseTermId']: 1,
    });
  });

  it('should handle set current service category id', () => {
    const state = reducer(initialPropertyState, PropertyActions.setCurrentServiceCategoryId(1));
    expect(state).toStrictEqual({
      ...initialPropertyState,
      ['currentServiceCategoryId']: 1,
    });
  });
});
