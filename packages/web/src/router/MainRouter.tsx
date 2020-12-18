import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

export const MainRouter = (): React.ReactElement => {
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path={DASHBOARD} component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
