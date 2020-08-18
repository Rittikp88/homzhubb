import React, { PureComponent } from 'react';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';

export interface IStateAwareComponentProps {
  loading: boolean;
  renderComponent: any;
}

// TODO: If full screen error and empty state required then add here

class StateAwareComponent extends PureComponent<IStateAwareComponentProps> {
  public render(): React.ReactNode {
    const { loading, renderComponent } = this.props;
    let renderView = null;
    if (loading) {
      renderView = <Loader visible />;
    } else {
      renderView = renderComponent;
    }
    return renderView;
  }
}

export { StateAwareComponent };
