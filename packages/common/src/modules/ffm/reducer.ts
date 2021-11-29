import { FFMActionPayloadTypes, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
import { IOnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IFFMState } from '@homzhub/common/src/modules/ffm/interface';

export const initialFFMState: IFFMState = {
  onBoardingData: [],
  roles: [],
  selectedRole: null,
  workLocations: [],
  loaders: {
    onBoarding: false,
    roles: false,
  },
};

export const ffmReducer = (
  state: IFFMState = initialFFMState,
  action: IFluxStandardAction<FFMActionPayloadTypes>
): IFFMState => {
  switch (action.type) {
    case FFMActionTypes.GET.ONBOARDING:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: true },
      };
    case FFMActionTypes.GET.ONBOARDING_SUCCESS:
      return {
        ...state,
        ['onBoardingData']: action.payload as IOnBoarding[],
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case FFMActionTypes.GET.ONBOARDING_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case FFMActionTypes.GET.ROLES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['roles']: true },
      };
    case FFMActionTypes.GET.ROLES_SUCCESS:
      return {
        ...state,
        ['roles']: action.payload as IUnit[],
        ['loaders']: { ...state.loaders, ['roles']: false },
      };
    case FFMActionTypes.GET.ROLES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['roles']: false },
      };
    case FFMActionTypes.SET.SELECTED_ROLE:
      return {
        ...state,
        ['selectedRole']: action.payload as Unit,
      };
    case FFMActionTypes.SET.WORK_LOCATION:
      return {
        ...state,
        ['workLocations']: action.payload as IWorkLocation[],
      };
    default:
      return {
        ...state,
      };
  }
};
