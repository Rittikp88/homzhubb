import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Dashboard from '@homzhub/web/src/screens/dashboard';

const Financials = lazy(() => import('@homzhub/web/src/screens/financials'));
const PostProperty = lazy(() => import('@homzhub/web/src/screens/addProperty/index'));
const HelpAndSupport = lazy(() => import('@homzhub/web/src/screens/helpAndSupport'));

export const MainRouter = (): React.ReactElement => {
  const { DASHBOARD, ADD_PROPERTY, APP_BASE, FINANCIALS, HELP_SUPPORT } = RouteNames.protectedRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={DASHBOARD} component={Dashboard} />
        <Route exact path={FINANCIALS} component={Financials} />
        <Route exact path={ADD_PROPERTY} component={PostProperty} />
        <Route exact path={HELP_SUPPORT} component={HelpAndSupport} />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};
