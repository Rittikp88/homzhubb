import React from 'react';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';

export interface ILatLng {
  lat: number;
  lng: number;
}

type AddPropertyContextType = {
  hasScriptLoaded: boolean;
  selectedPlaceId: string;
  latLng: ILatLng;
  setUpdatedPlaceId: (selectedPlaceId: string) => void;
  setUpdatedLatLng: (latLng: ILatLng) => void;
  navigateScreen: (action: string) => void;
};
export const AddPropertyContext = React.createContext<AddPropertyContextType>({
  hasScriptLoaded: false,
  selectedPlaceId: '',
  latLng: { lat: 0, lng: 0 },
  setUpdatedPlaceId: FunctionUtils.noop,
  setUpdatedLatLng: FunctionUtils.noop,
  navigateScreen: FunctionUtils.noop,
});
