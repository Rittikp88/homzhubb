import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import AddPropertyListing from '@homzhub/web/src/screens/addPropertyListing';
import Portfolio from '@homzhub/web/src/screens/portfolio';
import SearchProperty from '@homzhub/web/src/screens/searchProperty';

const Financials = lazy(() => import('@homzhub/web/src/screens/financials'));
const PostProperty = lazy(() => import('@homzhub/web/src/screens/addProperty/index'));
const HelpAndSupport = lazy(() => import('@homzhub/web/src/screens/helpAndSupport'));

export const MainRouter = (): React.ReactElement => {
  const {
    DASHBOARD,
    ADD_PROPERTY,
    FINANCIALS,
    HELP_SUPPORT,
    ADD_LISTING,
    PORTFOLIO,
    SEARCH_PROPERTY,
  } = RouteNames.protectedRoutes;
  const { APP_BASE } = RouteNames.publicRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={DASHBOARD} component={Dashboard} />
        <Route exact path={FINANCIALS} component={Financials} />
        <Route exact path={ADD_PROPERTY} component={PostProperty} />
        <Route exact path={HELP_SUPPORT} component={HelpAndSupport} />
        <Route exact path={ADD_LISTING} component={AddPropertyListing} />
        <Route exact path={PORTFOLIO} component={Portfolio} />
        <Route exact path={SEARCH_PROPERTY} component={SearchProperty} />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};
