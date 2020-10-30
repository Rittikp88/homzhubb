import React, { Suspense, lazy } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('@homzhub/web/src/screens/dashboard'));
const AboutPage = lazy(() => import('@homzhub/web/src/components/staticPages/about'));

export const MainRouter = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading Application...</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
