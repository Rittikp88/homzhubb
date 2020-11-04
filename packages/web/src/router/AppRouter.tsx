import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

const Layout = lazy(() => import('@homzhub/web/src/components/layout'));

export const AppRouter = (): React.ReactElement => {
  const { APP_BASE } = RouteNames.protectedRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <BrowserRouter>
        <Switch>
          <Route path={APP_BASE} component={Layout} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
