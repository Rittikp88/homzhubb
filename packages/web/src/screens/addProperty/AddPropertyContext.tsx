import React from 'react';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';

export interface ILatLng {
  lat: number;
  lng: number;
}

type AddPropertyContextType = {
  hasScriptLoaded: boolean;
  latLng: ILatLng;
  setUpdatedLatLng: (latLng: ILatLng) => void;
  navigateScreen: (action: string) => void;
};
export const AddPropertyContext = React.createContext<AddPropertyContextType>({
  hasScriptLoaded: false,
  latLng: { lat: 0, lng: 0 },
  setUpdatedLatLng: FunctionUtils.noop,
  navigateScreen: FunctionUtils.noop,
});
