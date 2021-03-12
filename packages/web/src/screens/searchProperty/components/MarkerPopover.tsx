import React, { useRef } from 'react';
import { View } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import MarkerCard from '@homzhub/web/src/screens/searchProperty/components/MarkerCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  markerClicked: boolean;
  children: React.ReactElement;
  onSelectMarker: (id: number | null) => void;
  propertyData: Asset;
}

const MarkerPopover: React.FC<IProps> = (props: IProps) => {
  const { markerClicked, children, onSelectMarker, propertyData } = props;
  const MarkerPopoverRef = useRef<PopupActions>(null);
  const onClosePopover = (): void => {
    if (MarkerPopoverRef && MarkerPopoverRef.current) {
      MarkerPopoverRef.current.close();
      onSelectMarker(null);
    }
  };

  return (
    <View>
      <Popover
        content={<MarkerCard onClosePopover={onClosePopover} propertyData={propertyData} />}
        popupProps={{
          open: markerClicked,
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            alignItems: 'stretch',
            width: 300,
            height: 300,
          },
          children: undefined,
          modal: false,
          position: 'top center',
          onClose: onClosePopover,
        }}
        forwardedRef={MarkerPopoverRef}
      >
        {children}
      </Popover>
    </View>
  );
};

export default MarkerPopover;
