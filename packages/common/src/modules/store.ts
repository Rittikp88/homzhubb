import { applyMiddleware, compose, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from '@redux-saga/core';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import rootReducer from '@homzhub/common/src/modules/reducers';
import rootSaga from '@homzhub/common/src/modules/sagas';

export const configureStore = (): Store<IState> => {
  // Redux middleware configurations
  const middleware = [];
  // Saga Middleware
  const sagaMiddleware = createSagaMiddleware();

  if (ConfigHelper.getAppMode() === AppModes.DEBUG) {
    // logger
    const logger = createLogger();
    middleware.push(logger);
  }

  middleware.push(sagaMiddleware);

  // store setup
  let store: Store = createStore(rootReducer, applyMiddleware(...middleware));
  if (ConfigHelper.getAppMode() === AppModes.DEBUG) {
    // @ts-ignore (To get actions seen in debugger more clearly in DEBUG mode alone)
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
  }

  // Kick off root saga
  sagaMiddleware.run(rootSaga);
  return store;
};
