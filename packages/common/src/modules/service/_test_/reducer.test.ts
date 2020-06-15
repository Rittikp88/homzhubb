import { serviceReducer as reducer, initialServiceState } from '@homzhub/common/src/modules/service/reducer';
import { ServiceActions } from '@homzhub/common/src/modules/service/actions';

describe('Service Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INITIAL_STATE' })).toEqual(initialServiceState);
  });

  it('should handle Get Service details', () => {
    // @ts-ignore
    const state = reducer(initialServiceState, ServiceActions.getServiceDetails());
    expect(state).toStrictEqual({
      ...initialServiceState,
      ['loaders']: { ...state.loaders, ['service']: true },
      ['error']: { ...state.error, ['service']: '' },
    });
  });

  it('should handle Get Service failure', () => {
    const state = reducer(initialServiceState, ServiceActions.getServiceDetailsFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialServiceState,
      ['loaders']: { ...state.loaders, ['service']: false },
      ['error']: { ...state.error, ['service']: 'Test Error' },
    });
  });
});
