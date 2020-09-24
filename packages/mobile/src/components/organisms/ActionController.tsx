import React from 'react';
import { ResaleDetailsForm, AssetListingSection } from '@homzhub/mobile/src/components';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

interface IProps {
  typeOfPlan: TypeOfPlan;
  isSplitAsUnits: boolean;
}

class ActionController extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { typeOfPlan } = this.props;
    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL ? (
          <AssetListingSection title="Action">
            <ResaleDetailsForm currency="₹" />
          </AssetListingSection>
        ) : null}
      </>
    );
  };
}

export { ActionController };
