import { ServiceActions, ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

describe('Property Actions', () => {
  it('should call get service detail action', () => {
    const action = ServiceActions.getServiceDetails();
    expect(action).toStrictEqual({
      type: ServiceActionTypes.GET.SERVICE_DETAILS,
    });
  });

  it('should call get service success action', () => {
    const action = ServiceActions.getServiceDetailsSuccess(ServicesData);
    expect(action).toStrictEqual({
      type: ServiceActionTypes.GET.SERVICE_DETAILS_SUCCESS,
      payload: ServicesData,
    });
  });

  it('should call get service failure action', () => {
    const action = ServiceActions.getServiceDetailsFailure('Test Error');
    expect(action).toStrictEqual({
      type: ServiceActionTypes.GET.SERVICE_DETAILS_FAILURE,
      error: 'Test Error',
    });
  });
});
