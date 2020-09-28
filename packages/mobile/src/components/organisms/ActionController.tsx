import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import LeaseTermController from '@homzhub/mobile/src/components/organisms/LeaseTermController';
import { SaleTermController } from '@homzhub/mobile/src/components/organisms/SaleTermController';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Country } from '@homzhub/common/src/domain/models/CountryCode';

interface IProps {
  typeOfPlan: TypeOfPlan;
  isSplitAsUnits: boolean;
  onNextStep: () => void;
  country: Country;
  propertyType: string;
}

interface IDispatchProps {
  setTermId: (termId: number) => void;
}

interface IStateProps {
  currentTermId: number;
  currentAssetId: number;
}

type Props = IStateProps & IDispatchProps & IProps;

// TODO (28/09/2020): Check if we need this wrapper at all after the implementation of manage flow & split unit lease flow
class ActionController extends React.PureComponent<Props, {}> {
  public render = (): React.ReactNode => {
    const { onNextStep } = this.props;
    const {
      typeOfPlan,
      currentTermId,
      setTermId,
      currentAssetId,
      country: { currencies },
      propertyType,
    } = this.props;
    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL && (
          <SaleTermController onNextStep={onNextStep} currentAssetId={currentAssetId} currency={currencies[0]} />
        )}
        {typeOfPlan === TypeOfPlan.RENT && (
          <LeaseTermController
            onNextStep={onNextStep}
            setTermId={setTermId}
            currencyData={currencies[0]}
            currentTermId={currentTermId}
            currentAssetId={currentAssetId}
            currentAssetType={propertyType}
          />
        )}
      </>
    );
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setTermId } = RecordAssetActions;
  return bindActionCreators({ setTermId }, dispatch);
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
