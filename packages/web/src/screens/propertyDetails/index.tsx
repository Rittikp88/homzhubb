import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import PropertyCardDetails from '@homzhub/web/src/screens/propertyDetails/components/PropertyCardDetails';
import SimilarProperties from '@homzhub/web/src/screens/propertyDetails/components/SimilarProperties';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IGetAssetPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IDispatchProps {
  getAsset: (payload: IGetAssetPayload) => void;
}

interface IStateProps {
  assetDetails: Asset | null;
}

interface IRouteProps {
  listingId: number;
  isLease: boolean;
}
interface IProps {
  history: History<IRouteProps>;
}
type Props = IDispatchProps & IStateProps & IProps;

const PropertyDetails: FC<Props> = (props: Props) => {
  const { assetDetails, history } = props;
  const { location } = history;
  const {
    state: { listingId, isLease },
  } = location;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);

  useEffect(() => {
    const { getAsset } = props;
    const payload: IGetAssetPayload = {
      propertyTermId: listingId,
    };
    getAsset(payload);
    scrollToTop();
  }, [listingId]);

  return (
    <View style={styles.container}>
      <PropertyCardDetails assetDetails={assetDetails} propertyTermId={listingId} />
      <View style={[styles.detail, isTablet && styles.detailTab, isMobile && styles.detailMobile]}>
        <SimilarProperties isMobile={isMobile} isTablet={isTablet} propertyTermId={listingId} isLease={isLease} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detail: {
    width: 1216,
  },
  detailMobile: {
    width: 350,
  },
  detailTab: {
    width: 700,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetDetails: AssetSelectors.getAsset(state),
  };
};

const scrollToTop = (): void => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAsset } = AssetActions;

  return bindActionCreators(
    {
      getAsset,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetails);
