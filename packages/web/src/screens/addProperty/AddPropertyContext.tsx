import React from 'react';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { GoogleGeocodeData } from '@homzhub/common/src/services/GooglePlaces/interfaces';

export interface ILatLng {
  lat: number;
  lng: number;
}

type AddPropertyContextType = {
  hasScriptLoaded: boolean;
  latLng: ILatLng;
  setUpdatedLatLng: (latLng: ILatLng) => void;
  navigateScreen: (action: string) => void;
  setPlacesData: (placeData: GoogleGeocodeData) => void;
  placeData: any;
  setAddressDetails: (addressComp: any) => void;
  addressDetails: any;
};
export const AddPropertyContext = React.createContext<AddPropertyContextType>({
  hasScriptLoaded: false,
  latLng: { lat: 0, lng: 0 },
  setUpdatedLatLng: FunctionUtils.noop,
  navigateScreen: FunctionUtils.noop,
  setPlacesData: FunctionUtils.noop,
  placeData: {},
  setAddressDetails: FunctionUtils.noop,
  addressDetails: {},
  // placeData: {
  //   address_components: [],
  //   geometry: {},
  //   place_id: '',
  //   types: [],
  //   formatted_address: '',
  // },
});
