import { Store } from 'redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';

let store: Store<IState>;

class StoreProviderService {
  public init(configureStore: any): void {
    store = configureStore();
  }

  public getStore(): Store<IState> {
    return store;
  }

  public getUserToken(): string {
    const state = this.getStore().getState();
    return state.user.tokens?.access_token ?? '';
  }

  public logoutUser(): void {
    store.dispatch(UserActions.logoutSuccess());
  }

  public loginSuccess(tokens: IUserTokens): void {
    store.dispatch(UserActions.loginSuccess(tokens));
  }
}

const storeProviderService = new StoreProviderService();
export { storeProviderService as StoreProviderService };
