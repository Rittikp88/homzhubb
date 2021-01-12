import React from 'react';

type AddPropertyContextType = {
  hasScriptLoaded: boolean;
};
export const AddPropertyContext = React.createContext<AddPropertyContextType | undefined>(undefined);
