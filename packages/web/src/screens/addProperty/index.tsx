import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import MapsPOC from '@homzhub/web/src/screens/addProperty/components/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';

const AddProperty: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [isDetailView, setDetailView] = useState(false);

  const onSubmit = (): void => {
    setDetailView(true);
  };

  const onEdit = (): void => {
    setDetailView(false);
  };
  return (
    <>
      {!isDetailView ? (
        <View style={[styles.container, isTablet && styles.containerTablet]}>
          <MapsPOC />
          <PropertyDetailsForm handleSubmit={onSubmit} />
        </View>
      ) : (
        <View style={[styles.detailViewContainer, isTablet && styles.containerTablet]}>
          <AddPropertyView
            onUploadImage={FunctionUtils.noop}
            onEditPress={onEdit}
            onNavigateToPlanSelection={FunctionUtils.noop}
            onNavigateToDetail={FunctionUtils.noop}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
  },
  detailViewContainer: {
    flex: 1,
  },
  containerTablet: {
    flexDirection: 'column',
  },
});
export default AddProperty;
