import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router';

export const ProtectedRoute = ({ ...routeProps }: RouteProps): React.ReactElement => {
  // TODO: Add isAuthorised Logic once implemented
  const isAuthorised = false;
  if (!isAuthorised) {
    return <Redirect to={{ pathname: '/login' }} />;
  }
  return <Route {...routeProps} />;
};
