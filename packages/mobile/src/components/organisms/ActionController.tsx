import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
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
            onNextStep={onNextStep}
            lastVisitedStep={lastVisitedStep}
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
            assetGroupType={assetGroupType}
            lastVisitedStep={lastVisitedStep}
            currencyData={currencies[0]}
            onNextStep={onNextStep}
          />
        )}
      </>
    );
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
