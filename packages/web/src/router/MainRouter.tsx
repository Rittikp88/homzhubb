import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import Portfolio from '@homzhub/web/src/screens/portfolio';
import AddProperty from '@homzhub/web/src/screens/addProperty';

export const MainRouter = (): React.ReactElement => {
  const { DASHBOARD, ADD_PROPERTY, APP_BASE, PORTFOLIO } = RouteNames.protectedRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path={DASHBOARD} component={Dashboard} />
          <Route exact path={PORTFOLIO} component={Portfolio} />
          <Route exact path={ADD_PROPERTY} component={AddProperty} />
          <Redirect exact path={APP_BASE} to={DASHBOARD} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
