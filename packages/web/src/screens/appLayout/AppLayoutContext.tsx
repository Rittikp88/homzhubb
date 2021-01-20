import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import React from 'react';

type AppLayoutContextType = {
  goBackClicked: boolean;
  setGoBackClicked: (value: boolean) => void;
};
export const AppLayoutContext = React.createContext<AppLayoutContextType>({
  goBackClicked: false,
  setGoBackClicked: FunctionUtils.noop,
});
