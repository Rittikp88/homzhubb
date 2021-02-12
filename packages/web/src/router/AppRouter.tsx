import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import SignUp from '@homzhub/web/src/screens/signUp';
import Landing from '@homzhub/web/src/screens/landing';
import MobileVerification from '@homzhub/web/src/components/organisms/MobileVerification';
import TermsAndCondition from '@homzhub/web/src/components/staticPages/TermsAndCondition';
import PrivacyPolicy from '@homzhub/web/src/components/staticPages/PrivacyPolicy';

export const AppRouter = (): React.ReactElement => {
  const { APP_BASE, TERMS_CONDITION, PRIVACY_POLICY, LOGIN, SIGNUP, OTP_VERIFICATION } = RouteNames.publicRoutes;
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { t } = useTranslation();
  const isDebugMode = ConfigHelper.getAppMode() === AppModes.DEBUG;
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={APP_BASE} component={Landing} />
        <Route exact path={OTP_VERIFICATION} component={MobileVerification} />

        <Route exact path={SIGNUP} component={SignUp} />
        <Route exact path={TERMS_CONDITION} component={TermsAndCondition} />
        <Route exact path={PRIVACY_POLICY} component={PrivacyPolicy} />
        {isDebugMode && (
          <>
            <Route exact path={LOGIN} component={Login} />
            <Route path={DASHBOARD} component={AppLayout} />
          </>
        )}
      </Switch>
    </Suspense>
  );
};
