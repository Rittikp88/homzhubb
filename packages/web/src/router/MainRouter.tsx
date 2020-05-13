import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../screens/homepage'));
const AboutPage = lazy(() => import('../screens/about'));

export const MainRouter = (): React.ReactElement => {
  return (
    <Suspense fallback={<div>Loading Application...</div>}>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
        </Switch>
      </div>
    </Suspense>
  );
};
