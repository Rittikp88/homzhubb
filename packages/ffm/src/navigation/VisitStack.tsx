import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SiteVisitDashboard from '@homzhub/ffm/src/screens/SiteVisits';
import FeedbackForm from '@homzhub/ffm/src/screens/SiteVisits/FeedbackForm';
import VisitForm from '@homzhub/ffm/src/screens/SiteVisits/VisitForm';
import { IFeedbackParam, IVisitParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type VisitStackParamList = {
  [ScreenKeys.SiteVisitDashboard]: undefined;
  [ScreenKeys.VisitForm]: IVisitParam;
  [ScreenKeys.FeedbackForm]: IFeedbackParam;
};

const VisitStackNavigator = createStackNavigator<VisitStackParamList>();

const VisitStack = (): React.ReactElement => {
  return (
    <VisitStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <VisitStackNavigator.Screen name={ScreenKeys.SiteVisitDashboard} component={SiteVisitDashboard} />
      <VisitStackNavigator.Screen name={ScreenKeys.VisitForm} component={VisitForm} />
      <VisitStackNavigator.Screen name={ScreenKeys.FeedbackForm} component={FeedbackForm} />
    </VisitStackNavigator.Navigator>
  );
};

export default VisitStack;
