import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';

export const AppRouter = (): React.ReactElement => {
  const { APP_BASE, DASHBOARD } = RouteNames.protectedRoutes;
  const { LOGIN } = RouteNames.publicRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route path={LOGIN} component={Login} />
        <Route path={DASHBOARD} component={AppLayout} />
        <Redirect exact path={APP_BASE} to={LOGIN} />
      </Switch>
    </Suspense>
  );
};
