import { Store } from 'redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
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

  public getUserRefreshToken(): string {
    const state = this.getStore().getState();
    return state.user.tokens?.refresh_token ?? '';
  }

  public logoutUser(): void {
    store.dispatch(UserActions.logoutSuccess());
    store.dispatch(SearchActions.setInitialState());
    store.dispatch(UserActions.clearFavouriteProperties());
  }

  public logoutUserAndClearTokens(): void {
    store.dispatch(UserActions.logout());
  }

  public loginSuccess(tokens: IUserTokens): void {
    store.dispatch(UserActions.loginSuccess(tokens));
  }
}

const storeProviderService = new StoreProviderService();
export { storeProviderService as StoreProviderService };
