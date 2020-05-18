import React, { Suspense, lazy } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('../screens/homepage'));
const AboutPage = lazy(() => import('../screens/about'));

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
