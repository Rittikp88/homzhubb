import React from 'react';

export class More extends React.PureComponent {
  /* It has to return null because we dont want any navigation. Since bottom tab navigator expects a class component,
  we are returning null.
  */
  public render = (): React.ReactNode => {
    return null;
  };
}
