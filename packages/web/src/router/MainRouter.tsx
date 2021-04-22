import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import PrivateRoute from '@homzhub/web/src/router/PrivateRoute';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import AddPropertyListing from '@homzhub/web/src/screens/addPropertyListing';
import ComingSoon from '@homzhub/web/src/screens/comingSoon';
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

const MainRouter = (props: MainRouterProps): React.ReactElement => {
  const { isAuthenticated } = props;
  const {
    DASHBOARD,
    ADD_PROPERTY,
    PORTFOLIO_ADD_PROPERTY,
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
    SAVED_PROPERTIES,
    PROPERTY_VISITS,
  } = RouteNames.protectedRoutes;
  const { APP_BASE } = RouteNames.publicRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <PrivateRoute exact path={DASHBOARD} component={Dashboard} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={FINANCIALS} component={Financials} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={ADD_PROPERTY} component={PostProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={HELP_SUPPORT} component={HelpAndSupport} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={ADD_LISTING} component={AddPropertyListing} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PORTFOLIO} component={Portfolio} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PORTFOLIO_ADD_PROPERTY} component={PostProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_DETAIL} component={PropertyDetails} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SEARCH_PROPERTY} component={SearchProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_VIEW} component={PropertyView} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SELECT_PROPERTY} component={SelectProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SELECT_SERVICES} component={SelectServices} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SAVED_PROPERTIES} component={ComingSoon} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_VISITS} component={ComingSoon} isAuthenticated={isAuthenticated} />
        <PrivateRoute
          exact
          path={VALUE_ADDED_SERVICES}
          component={ValueAddedServices}
          isAuthenticated={isAuthenticated}
        />
        <PrivateRoute
          exact
          path={PROPERTY_SELECTED}
          component={PropertyDetailsOwner}
          isAuthenticated={isAuthenticated}
        />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};

const mapStateToProps = (state: any): any => {
  const { isLoggedIn } = UserSelector;
  return {
    isAuthenticated: isLoggedIn(state),
  };
};

const connector = connect(mapStateToProps, null);

type MainRouterProps = ConnectedProps<typeof connector>;

export default connector(MainRouter);
