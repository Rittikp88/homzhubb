import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';

export const AppRouter = (): React.ReactElement => {
  const { APP_BASE } = RouteNames.protectedRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <BrowserRouter>
        <Switch>
          <Route path={APP_BASE} component={AppLayout} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
