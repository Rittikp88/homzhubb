import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from '@redux-saga/core';
import { IState } from '@homzhub/common/src/modules/interfaces';
import rootReducer from '@homzhub/common/src/modules/reducers';
import rootSaga from '@homzhub/common/src/modules/sagas';

export const configureStore = (): Store<IState> => {
  // Redux middleware configurations
  const middleware = [];

  // logger
  const logger = createLogger();

  // Saga Middleware
  const sagaMiddleware = createSagaMiddleware();

  middleware.push(sagaMiddleware);
  middleware.push(logger);

  // store setup
  const store = createStore(rootReducer, applyMiddleware(...middleware));

  // Kick off root saga
  sagaMiddleware.run(rootSaga);
  return store;
};
