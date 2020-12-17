import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import HaveAnyQuestionsForm from '@homzhub/web/src/screens/HelpAndSupportForm/HaveAnyQuestionsForm';

export const AppRouter = (): React.ReactElement => {
  const { APP_BASE, DASHBOARD, HAVEANYQUESTIONSFORM } = RouteNames.protectedRoutes;
  const { LOGIN } = RouteNames.publicRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <BrowserRouter>
        <Switch>
          <Route path={LOGIN} component={Login} />
          <Route path={DASHBOARD} component={AppLayout} />
          <Route exact path={HAVEANYQUESTIONSFORM} component={HaveAnyQuestionsForm} />
          <Redirect exact path={APP_BASE} to={LOGIN} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
