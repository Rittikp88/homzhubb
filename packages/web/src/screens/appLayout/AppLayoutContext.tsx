import React from 'react';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';

export interface IFinancialsActions {
  financialsActionType: FinancialsActions | null;
  isOpen: boolean;
}

type AppLayoutContextType = {
  goBackClicked: boolean;
  setGoBackClicked: (value: boolean) => void;
  isMenuLoading: boolean;
  setIsMenuLoading: (value: boolean) => void;
  financialsActions: IFinancialsActions;
  setFinancialsActions: (value: IFinancialsActions) => void;
};
export const AppLayoutContext = React.createContext<AppLayoutContextType>({
  goBackClicked: false,
  setGoBackClicked: FunctionUtils.noop,
  isMenuLoading: false,
  setIsMenuLoading: FunctionUtils.noop,
  financialsActions: {
    financialsActionType: null,
    isOpen: false,
  },
  setFinancialsActions: FunctionUtils.noop,
});
