import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { History } from 'history';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import PropertyCard from '@homzhub/web/src/screens/propertyDetailOwner/Components/PropertyCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IDispatchProps {
  getAssetById: () => void;
}

interface IStateProps {
  assetDetails: Asset | null;
}

interface IRouteProps {
  propertyId: number;
}
interface IProps {
  history: History<IRouteProps>;
}
type Props = IDispatchProps & IStateProps & IProps;

const PropertyDetailsOwner: FC<Props> = (props: Props) => {
  const { assetDetails, history } = props;
  const { location } = history;
  const {
    state: { propertyId },
  } = location;
  const dispatch = useDispatch();
  useEffect(() => {
    const { getAssetById } = props;
    dispatch(RecordAssetActions.setAssetId(propertyId));
    getAssetById();
  }, []);

  return (
    <View style={styles.container}>
      <PropertyCard assetDetails={assetDetails} propertyTermId={propertyId} />
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
  const { getAssetDetails } = RecordAssetSelectors;
  return {
    assetDetails: getAssetDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById } = RecordAssetActions;

  return bindActionCreators(
    {
      getAssetById,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetailsOwner);
