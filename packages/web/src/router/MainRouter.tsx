import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import AddPropertyListing from '@homzhub/web/src/screens/addPropertyListing';
import Portfolio from '@homzhub/web/src/screens/portfolio';
import PropertyDetails from '@homzhub/web/src/screens/propertyDetails';
import SearchProperty from '@homzhub/web/src/screens/searchProperty';
import ValueAddedServices from '@homzhub/web/src/screens/valueAddedServices';
import SelectProperty from '@homzhub/web/src/screens/selectProperty';
import SelectServices from '@homzhub/web/src/screens/selectServices';
import PropertyDetailsOwner from '@homzhub/web/src/screens/propertyDetailOwner';

// Lazy imports
const Financials = lazy(() => import('@homzhub/web/src/screens/financials'));
const PostProperty = lazy(() => import('@homzhub/web/src/screens/addProperty/index'));
const HelpAndSupport = lazy(() => import('@homzhub/web/src/screens/helpAndSupport'));
const PropertyView = lazy(() => import('@homzhub/common/src/components/organisms/AddPropertyView'));

export const MainRouter = (): React.ReactElement => {
  const {
    DASHBOARD,
    ADD_PROPERTY,
    FINANCIALS,
    HELP_SUPPORT,
    ADD_LISTING,
    PORTFOLIO,
    PROPERTY_DETAIL,
    SEARCH_PROPERTY,
    PROPERTY_VIEW,
    PROPERTY_SELECTED,
    VALUE_ADDED_SERVICES,
    SELECT_PROPERTY,
    SELECT_SERVICES,
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
        <Route exact path={PROPERTY_DETAIL} component={PropertyDetails} />
        <Route exact path={SEARCH_PROPERTY} component={SearchProperty} />
        <Route exact path={PROPERTY_VIEW} component={PropertyView} />
        <Route exact path={SELECT_PROPERTY} component={SelectProperty} />
        <Route exact path={SELECT_SERVICES} component={SelectServices} />
        <Route exact path={VALUE_ADDED_SERVICES} component={ValueAddedServices} />
        <Route exact path={PROPERTY_SELECTED} component={PropertyDetailsOwner} />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};
