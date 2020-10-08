import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import LeaseTermController from '@homzhub/mobile/src/components/organisms/LeaseTermController';
import { SaleTermController } from '@homzhub/mobile/src/components/organisms/SaleTermController';
import { ManageTermController } from '@homzhub/mobile/src/components/organisms/ManageTermController';
import { Country } from '@homzhub/common/src/domain/models/CountryCode';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IProps {
  typeOfPlan: TypeOfPlan;
  isSplitAsUnits: boolean;
  onNextStep: () => void;
  country: Country;
  assetGroupType: string;
  furnishing: FurnishingTypes;
  lastVisitedStep: ILastVisitedStep;
}

interface IDispatchProps {
  setTermId: (termId: number) => void;
  getMaintenanceUnits: () => void;
}

interface IStateProps {
  currentTermId: number;
  currentAssetId: number;
}

type Props = IStateProps & IDispatchProps & IProps;

// TODO (Aditya): Optimize, look at un-required props drilling
class ActionController extends React.PureComponent<Props, {}> {
  public componentDidMount = (): void => {
    const { getMaintenanceUnits, assetGroupType } = this.props;
    if (assetGroupType === AssetGroupTypes.COM) {
      getMaintenanceUnits();
    }
  };

  public render = (): React.ReactNode => {
    const { onNextStep } = this.props;
    const {
      typeOfPlan,
      currentTermId,
      setTermId,
      currentAssetId,
      country: { currencies },
      assetGroupType,
      lastVisitedStep,
      furnishing,
    } = this.props;
    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL && (
          <SaleTermController
            currentAssetId={currentAssetId}
            assetGroupType={assetGroupType}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
          />
        )}
        {typeOfPlan === TypeOfPlan.RENT && (
          <LeaseTermController
            currentAssetId={currentAssetId}
            currentTermId={currentTermId}
            assetGroupType={assetGroupType}
            setTermId={setTermId}
            furnishing={furnishing}
            lastVisitedStep={lastVisitedStep}
            currencyData={currencies[0]}
            onNextStep={onNextStep}
          />
        )}
        {typeOfPlan === TypeOfPlan.MANAGE && (
          <ManageTermController
            currentAssetId={currentAssetId}
            assetGroupType={assetGroupType}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
          />
        )}
      </>
    );
  };

  private onNextStep = async (type: TypeOfPlan): Promise<void> => {
    const { onNextStep, lastVisitedStep, currentAssetId } = this.props;

    const last_visited_step = {
      ...lastVisitedStep,
      listing: {
        ...lastVisitedStep.listing,
        type,
        is_listing_created: true,
      },
    };
    await AssetRepository.updateAsset(currentAssetId, { last_visited_step });
    onNextStep();
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setTermId, getMaintenanceUnits } = RecordAssetActions;
  return bindActionCreators({ setTermId, getMaintenanceUnits }, dispatch);
};

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentTermId, getCurrentAssetId } = RecordAssetSelectors;
  return {
    currentTermId: getCurrentTermId(state),
    currentAssetId: getCurrentAssetId(state),
  };
};

const HOC = connect(mapStateToProps, mapDispatchToProps)(ActionController);
export { HOC as ActionController };
