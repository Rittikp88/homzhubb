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
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  assetDetails: Asset;
  typeOfPlan: TypeOfPlan;
  leaseType: LeaseTypes;
  onNextStep: () => void;
  scrollToTop: () => void;
  onLeaseTypeChange: (leaseType: LeaseTypes) => void;
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
    const {
      assetDetails: {
        id,
        assetGroupCode,
        furnishing,
        assetLeaseType,
        country: { currencies },
      },
      leaseType,
      typeOfPlan,
      scrollToTop,
      onLeaseTypeChange,
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
            assetLeaseType={assetLeaseType}
            leaseType={leaseType}
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            furnishing={furnishing}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
            scrollToTop={scrollToTop}
            onLeaseTypeChange={onLeaseTypeChange}
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

  private onNextStep = async (type: TypeOfPlan, params?: IUpdateAssetParams): Promise<void> => {
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
    const reqBody = params ? { last_visited_step, ...params } : { last_visited_step };
    await AssetRepository.updateAsset(id, reqBody);
    onNextStep();
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMaintenanceUnits } = RecordAssetActions;
  return bindActionCreators({ getMaintenanceUnits }, dispatch);
};

const HOC = connect(null, mapDispatchToProps)(ActionController);
export { HOC as ActionController };
