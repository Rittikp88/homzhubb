import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import PropertyCard from '@homzhub/web/src/screens/propertyDetailOwner/Components/PropertyCard';
import ConfirmationContent from '@homzhub/web/src/components/atoms/ConfirmationContent';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import CancelTerminateListing from '@homzhub/web/src/components/molecules/CancelTerminateListing';
import { UpdatePropertyFormTypes } from '@homzhub/web/src/screens/portfolio';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import {
  ClosureReasonType,
  DetailType,
  IPropertyDetailPayload,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IDispatchProps {
  clearAsset: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
}

interface IStateProps {
  assetPayload: ISetAssetPayload;
}

interface IRouteProps {
  isFromTenancies?: boolean;
  asset_id: number;
  assetType: DetailType;
  listing_id: number;
}
interface IProps {
  history: History<IRouteProps>;
}
type Props = IDispatchProps & IStateProps & IProps;

const PropertyDetailsOwner: FC<Props> = (props: Props) => {
  const { history } = props;
  const { location } = history;

  const {
    state: { isFromTenancies, asset_id, assetType, listing_id },
  } = location;
  const popupRef = useRef<PopupActions>(null);

  const [propertyData, setPropertyData] = useState<Asset | null>(null);
  useEffect(() => {
    if (!asset_id) {
      return;
    }
    const payload: IPropertyDetailPayload = {
      asset_id,
      id: listing_id,
      type: assetType,
    };
    try {
      PortfolioRepository.getPropertyDetail(payload).then((response) => {
        setPropertyData(response);
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  }, []);

  const [payloads, setPayloads] = useState<IClosureReasonPayload | null>(null);
  const [params, setParams] = useState<IListingParam | null>(null);
  const [formType, setFormType] = useState('');
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const updateData = (): void => {
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PORTFOLIO,
    });
  };
  const onCompleteDetails = (assetId: number): void => {
    const { setAssetId, setEditPropertyFlow } = props;
    setAssetId(assetId);
    setEditPropertyFlow(true);
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_VIEW,
      params: {
        previousScreen: 'Portfolio',
      },
    });
  };
  const submitSuccess = (): void => {
    setSubmittedSuccessfully(true);
  };
  const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void => {
    if (propertyData) {
      setPayloads(payload);
      if (param) {
        setParams(param);
      }
      handleActions(propertyData, payload, param);
    }
  };
  const handleActions = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { setAssetId } = props;
    const { id } = asset;
    setAssetId(id);
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formTypes = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    setFormType(formTypes);
    const onNavigateToPlanSelection = (): void => {
      NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING });
    };
    if (param && param.hasTakeAction) {
      onNavigateToPlanSelection();
    } else if (formTypes === CancelListing) {
      if (popupRef && popupRef.current) {
        popupRef.current.open();
      }
    }
  };
  const onClosePopover = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  return (
    <View style={styles.container}>
      <PropertyCard
        assetDetails={propertyData}
        propertyTermId={asset_id}
        isFromTenancies={isFromTenancies}
        onCompleteDetails={onCompleteDetails}
        onHandleAction={onPressAction}
      />
      <View>
        <Popover
          content={
            !submittedSuccessfully ? (
              <CancelTerminateListing
                assetDetails={propertyData}
                formType={formType}
                param={params}
                payload={payloads}
                closeModal={onClosePopover}
                submit={submitSuccess}
              />
            ) : (
              <ConfirmationContent closeModal={onClosePopover} updateData={updateData} />
            )
          }
          forwardedRef={popupRef}
          popupProps={{
            onClose: onClosePopover,
            modal: true,
            arrow: false,
            contentStyle: {
              width: !submittedSuccessfully ? 385 : 480,
              height: !submittedSuccessfully ? 569 : undefined,
              overflowY: 'scroll',
            },
            closeOnDocumentClick: false,
            children: undefined,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { clearAsset } = AssetActions;
  const { setAssetId, setEditPropertyFlow } = RecordAssetActions;

  return bindActionCreators(
    {
      clearAsset,
      setEditPropertyFlow,
      setAssetId,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetailsOwner);
