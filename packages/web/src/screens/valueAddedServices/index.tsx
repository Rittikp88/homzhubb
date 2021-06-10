import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

interface IProps {
  propertyAdded: number;
}

const ValueAddedServices: FC<IProps> = ({ propertyAdded = 0 }: IProps) => {
  if (!propertyAdded) {
    const { SELECT_PROPERTY } = RouteNames.protectedRoutes;
    return <Redirect to={SELECT_PROPERTY} />;
  }

  return <View style={styles.container}>hello there</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ValueAddedServices;
