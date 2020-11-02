import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ScreensKeys } from '@homzhub/web/src/router/interfaces';

const Dashboard = lazy(() => import('@homzhub/web/src/screens/dashboard'));
const AboutPage = lazy(() => import('@homzhub/web/src/components/staticPages/about'));

export const MainRouter = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading Application...</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path={ScreensKeys.dashboard} component={Dashboard} />
          <Route exact path={ScreensKeys.about} component={AboutPage} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
