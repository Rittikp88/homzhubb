import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import Landing from '@homzhub/web/src/screens/landing';
import TermsAndCondition from '@homzhub/web/src/components/staticPages/TermsAndCondition';
import PrivacyPolicy from '@homzhub/web/src/components/staticPages/PrivacyPolicy';

export const AppRouter = (): React.ReactElement => {
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { APP_BASE, TERMS_CONDITION, PRIVACY_POLICY, LOGIN } = RouteNames.publicRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={APP_BASE} component={Landing} />
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={DASHBOARD} component={AppLayout} />
        <Route exact path={TERMS_CONDITION} component={TermsAndCondition} />
        <Route exact path={PRIVACY_POLICY} component={PrivacyPolicy} />
      </Switch>
    </Suspense>
  );
};
