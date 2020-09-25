import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { SaleTermController } from '@homzhub/mobile/src/components/organisms/SaleTermController';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

interface IProps {
  typeOfPlan: TypeOfPlan;
  isSplitAsUnits: boolean;
  onNextStep: () => void;
}

interface IDispatchProps {
  setTermId: (termId: number) => void;
}

interface IStateProps {
  currentTermId: number;
  currentAssetId: number;
}

type Props = IStateProps & IDispatchProps & IProps;

class ActionController extends React.PureComponent<Props, {}> {
  public render = (): React.ReactNode => {
    const { onNextStep } = this.props;
    const { typeOfPlan, currentTermId, setTermId, currentAssetId } = this.props;
    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL ? (
          <SaleTermController
            onNextStep={onNextStep}
            setTermId={setTermId}
            currentTermId={currentTermId}
            currentAssetId={currentAssetId}
          />
        ) : null}
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
