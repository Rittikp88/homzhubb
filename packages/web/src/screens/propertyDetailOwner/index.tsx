import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import {
  DetailType,
  IPropertyDetailPayload,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';

import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import PropertyCard from '@homzhub/web/src/screens/propertyDetailOwner/Components/PropertyCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
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
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  }, []);

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
  const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void => {
    if (propertyData) {
      handleActions(propertyData, payload, param);
    }
  };
  const handleActions = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { setAssetId } = props;
    const { id } = asset;
    setAssetId(id);
    const onNavigateToPlanSelection = (): void => {
      NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING });
    };
    if (param && param.hasTakeAction) {
      onNavigateToPlanSelection();
    } else {
      // TODO : Handle logic for cancel and terminate once the screens are ready
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
