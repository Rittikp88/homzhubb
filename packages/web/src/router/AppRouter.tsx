import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

const AppLayout = lazy(() => import('@homzhub/web/src/components/organisms/AppLayout'));

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
