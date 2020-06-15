import { IState } from '@homzhub/common/src/modules/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialServiceState } from '@homzhub/common/src/modules/service/reducer';
import { ServiceSelector } from '@homzhub/common/src/modules/service/selectors';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

const state: IState = {
  user: {
    ...initialUserState,
  },
  property: {
    ...initialPropertyState,
  },
  service: {
    ...initialServiceState,
    servicesData: ServicesData,
  },
};

describe('Service Selector', () => {
  it('should return the Service data', () => {
    expect(ServiceSelector.getServiceDetails(state)).toBe(ServicesData);
  });
});
