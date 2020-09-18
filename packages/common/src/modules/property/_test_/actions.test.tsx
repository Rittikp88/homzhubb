import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';

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

  it('should call get service detail action', () => {
    const action = PropertyActions.getServiceDetails(1);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_DETAILS,
      payload: 1,
    });
  });

  it('should call get service success action', () => {
    const action = PropertyActions.getServiceDetailsSuccess(ServicesData);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_DETAILS_SUCCESS,
      payload: ServicesData,
    });
  });

  it('should call get service failure action', () => {
    const action = PropertyActions.getServiceDetailsFailure('Test Error');
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_DETAILS_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call get service steps action', () => {
    const action = PropertyActions.getServiceStepsDetails({ serviceCategoryId: 1, serviceId: 1 });
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_STEPS,
      payload: { serviceCategoryId: 1, serviceId: 1 },
    });
  });

  it('should call get service steps success action', () => {
    const action = PropertyActions.getServiceStepsDetailsSuccess(ServiceSteps);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_STEPS_SUCCESS,
      payload: ServiceSteps,
    });
  });

  it('should call get service steps failure action', () => {
    const action = PropertyActions.getServiceStepsDetailsFailure('Test Error');
    expect(action).toStrictEqual({
      type: PropertyActionTypes.GET.SERVICE_STEPS_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call set current property id', () => {
    const action = PropertyActions.setCurrentPropertyId(1);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.SET.CURRENT_PROPERTY_ID,
      payload: 1,
    });
  });

  it('should call set current lease term id', () => {
    const action = PropertyActions.setTermId(1);
    expect(action).toStrictEqual({
      type: PropertyActionTypes.SET.TERM_ID,
      payload: 1,
    });
  });
});
