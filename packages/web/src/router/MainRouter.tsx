import React, { Suspense, lazy } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

const AboutPage = lazy(() => import('../components/staticPages/about'));

export const MainRouter = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading Application...</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/about" component={AboutPage} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};
