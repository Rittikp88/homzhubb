import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OverlayView } from '@react-google-maps/api';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import MarkerPopover from '@homzhub/web/src/screens/searchProperty/components/MarkerPopover';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';

interface IProps {
  position: ILatLng;
  selected: boolean;
  propertyData: Asset;
  onSelectMarker: (id: number | null) => void;
}

const CustomMarker = (props: IProps): React.ReactElement => {
  const { position, selected, onSelectMarker, propertyData } = props;
  const renderMarker = (isSelected: boolean): React.ReactNode => {
    if (!isSelected) {
      return (
        <View>
          <Icon name={icons.selectionMarker} color={theme.colors.darkTint4} size={24} />
        </View>
      );
    }

    return (
      <View>
        <MarkerPopover markerClicked={isSelected} onSelectMarker={onSelectMarker} propertyData={propertyData}>
          <Icon name={icons.selectionMarker} color={theme.colors.blue} size={42} />
        </MarkerPopover>
      </View>
    );
  };

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <TouchableOpacity onPress={(): void => onSelectMarker(propertyData.id)}>
        {renderMarker(selected)}
      </TouchableOpacity>
    </OverlayView>
  );
};

const memoizedComponent = React.memo(CustomMarker);
export { memoizedComponent as CustomMarker };
