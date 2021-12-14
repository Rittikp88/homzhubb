import { FFMActionPayloadTypes, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
import { IFeedback } from '@homzhub/common/src/domain/models/Feedback';
import { IFFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IInspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { IOnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Report } from '@homzhub/common/src/domain/models/Report';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IFFMState } from '@homzhub/common/src/modules/ffm/interface';

export const initialFFMState: IFFMState = {
  onBoardingData: [],
  roles: [],
  selectedRole: null,
  workLocations: [],
  visits: [],
  visitDetail: null,
  reasons: [],
  feedback: null,
  inspectionReport: null,
  currentReport: null,
  loaders: {
    onBoarding: false,
    roles: false,
    visits: false,
    visitDetail: false,
    reasons: false,
    feedback: false,
    inspectionReport: false,
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
    case FFMActionTypes.GET.VISITS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: true },
      };
    case FFMActionTypes.GET.VISITS_SUCCESS:
      return {
        ...state,
        ['visits']: action.payload as IFFMVisit[],
        ['loaders']: { ...state.loaders, ['visits']: false },
      };
    case FFMActionTypes.GET.VISITS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: false },
      };
    case FFMActionTypes.GET.VISIT_DETAIL:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visitDetail']: true },
      };
    case FFMActionTypes.GET.VISIT_DETAIL_SUCCESS:
      return {
        ...state,
        ['visitDetail']: action.payload as IFFMVisit,
        ['loaders']: { ...state.loaders, ['visitDetail']: false },
      };
    case FFMActionTypes.GET.VISIT_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visitDetail']: false },
      };
    case FFMActionTypes.GET.REJECTION_REASON:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reasons']: true },
      };
    case FFMActionTypes.GET.REJECTION_REASON_SUCCESS:
      return {
        ...state,
        ['reasons']: action.payload as IUnit[],
        ['loaders']: { ...state.loaders, ['reasons']: false },
      };
    case FFMActionTypes.GET.REJECTION_REASON_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reasons']: false },
      };
    case FFMActionTypes.GET.FEEDBACK:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['feedback']: true },
      };
    case FFMActionTypes.GET.FEEDBACK_SUCCESS:
      return {
        ...state,
        ['feedback']: action.payload as IFeedback,
        ['loaders']: { ...state.loaders, ['feedback']: false },
      };
    case FFMActionTypes.GET.FEEDBACK_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['feedback']: false },
      };
    case FFMActionTypes.CLEAR.FEEDBACK_DATA:
      return {
        ...state,
        ['feedback']: null,
      };
    case FFMActionTypes.GET.INSPECTION_REPORT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['inspectionReport']: true },
      };
    case FFMActionTypes.GET.INSPECTION_REPORT_SUCCESS:
      return {
        ...state,
        ['inspectionReport']: action.payload as IInspectionReport,
        ['loaders']: { ...state.loaders, ['inspectionReport']: false },
      };
    case FFMActionTypes.GET.INSPECTION_REPORT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['inspectionReport']: false },
      };
    case FFMActionTypes.SET.CURRENT_REPORT:
      return {
        ...state,
        ['currentReport']: action.payload as Report,
      };
    case FFMActionTypes.CLEAR.SELECTED_REPORT:
      return {
        ...state,
        ['currentReport']: null,
      };
    default:
      return {
        ...state,
      };
  }
};
