import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import Portfolio from '@homzhub/web/src/screens/portfolio';
import AddProperty from '@homzhub/web/src/screens/addProperty';

const Financials = lazy(() => import('@homzhub/web/src/screens/Financials'));
export const MainRouter = (): React.ReactElement => {
  const { DASHBOARD, PORTFOLIO, ADD_PROPERTY, APP_BASE, FINANCIALS } = RouteNames.protectedRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={DASHBOARD} component={Dashboard} />
        <Route exact path={PORTFOLIO} component={Portfolio} />
        <Route exact path={ADD_PROPERTY} component={AddProperty} />
        <Route exact path={FINANCIALS} component={Financials} />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};
