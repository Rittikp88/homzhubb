import { Store } from 'redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';

let store: Store<IState>;

class StoreProviderService {
  public init(configureStore: any): void {
    store = configureStore();
  }

  public getStore(): Store<IState> {
    return store;
  }

  public logoutUser(): void {
    store.dispatch(UserActions.logoutSuccess());
  }
}

const storeProviderService = new StoreProviderService();
export { storeProviderService as StoreProviderService };
