import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import AddListingView from '@homzhub/web/src/screens/addPropertyListing/AddListingView';

enum ComponentName {
  Listing_Plan_Selection = 'ListingPlanSelection',
  Add_Listing_Detail = 'AddListingDetail',
}

const AddPropertyListing = (): React.ReactElement => {
  const [scene, setScene] = useState(ComponentName.Listing_Plan_Selection);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(RecordAssetActions.setAssetId(369));
  });

  const renderScene = (): React.ReactElement | null => {
    switch (scene) {
      case ComponentName.Listing_Plan_Selection:
        return (
          <PlanSelection
            carouselView={renderCarousel()}
            onSelectPlan={handlePlanSelection}
            onSkip={FunctionUtils.noop}
          />
        );
      case ComponentName.Add_Listing_Detail:
        return <AddListingView onUploadDocument={FunctionUtils.noop} />;
      default:
        return null;
    }
  };

  const renderCarousel = (): React.ReactElement => {
    return (
      <View style={styles.carouselView}>
        <Text>TODO: Add Advertisement Here</Text>
      </View>
    );
  };

  const handlePlanSelection = (): void => {
    setScene(ComponentName.Add_Listing_Detail);
  };

  return <View style={styles.container}>{renderScene()}</View>;
};

export default AddPropertyListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  carouselView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    marginLeft: 12,
  },
});
