import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import PropertyCardDetails from '@homzhub/web/src/screens/PropertyDetails/components/PropertyCardDetails';
import SimilarProperties from '@homzhub/web/src/screens/PropertyDetails/components/SimilarProperties';
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

type IProps = IDispatchProps & IStateProps;
const PropertyDetails: FC<IProps> = (props: IProps) => {
  const { assetDetails } = props;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  useEffect(() => {
    const { getAsset } = props;
    const payload: IGetAssetPayload = {
      // TODO: Add route navigation for getting property ID
      propertyTermId: 302,
    };
    getAsset(payload);
  }, []);
  return (
    <View style={styles.container}>
      {/* // TODO: Add route navigation for getting property ID */}
      <PropertyCardDetails assetDetails={assetDetails} propertyTermId={302} />
      <SimilarProperties isMobile={isMobile} isTablet={isTablet} propertyTermId={302} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetDetails: AssetSelectors.getAsset(state),
  };
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
