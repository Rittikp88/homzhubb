import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import LeaseTermController from '@homzhub/mobile/src/components/organisms/LeaseTermController';
import { SaleTermController } from '@homzhub/mobile/src/components/organisms/SaleTermController';
import { ManageTermController } from '@homzhub/mobile/src/components/organisms/ManageTermController';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  assetDetails: Asset;
  typeOfPlan: TypeOfPlan;
  isSplitAsUnits: boolean;
  onNextStep: () => void;
  scrollToTop: () => void;
  togglePropertyUnits: () => void;
}

interface IDispatchProps {
  getMaintenanceUnits: () => void;
}

type Props = IDispatchProps & IProps;

class ActionController extends React.PureComponent<Props, {}> {
  public componentDidMount = (): void => {
    const {
      getMaintenanceUnits,
      assetDetails: { assetGroupCode },
    } = this.props;

    if (assetGroupCode === AssetGroupTypes.COM) {
      getMaintenanceUnits();
    }
  };

  public render = (): React.ReactNode => {
    const { isSplitAsUnits } = this.props;
    const {
      assetDetails: {
        id,
        assetGroupCode,
        furnishing,
        country: { currencies },
      },
      typeOfPlan,
      scrollToTop,
      togglePropertyUnits,
    } = this.props;

    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL && (
          <SaleTermController
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
          />
        )}
        {typeOfPlan === TypeOfPlan.RENT && (
          <LeaseTermController
            isSplitAsUnits={isSplitAsUnits}
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            furnishing={furnishing}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
            scrollToTop={scrollToTop}
            togglePropertyUnits={togglePropertyUnits}
          />
        )}
        {typeOfPlan === TypeOfPlan.MANAGE && (
          <ManageTermController
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
          />
        )}
      </>
    );
  };

  private onNextStep = async (type: TypeOfPlan): Promise<void> => {
    const {
      onNextStep,
      assetDetails: { lastVisitedStepSerialized, id },
    } = this.props;

    const last_visited_step = {
      ...lastVisitedStepSerialized,
      listing: {
        ...lastVisitedStepSerialized.listing,
        type,
        is_listing_created: true,
      },
    };
    await AssetRepository.updateAsset(id, { last_visited_step });
    onNextStep();
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMaintenanceUnits } = RecordAssetActions;
  return bindActionCreators({ getMaintenanceUnits }, dispatch);
};

const HOC = connect(null, mapDispatchToProps)(ActionController);
export { HOC as ActionController };
