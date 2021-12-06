import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Feedback, IFeedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMVisit, IFFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IOnBoarding, OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFFMVisitParam, IGetFeedbackParam, IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'FFM/';
export const FFMActionTypes = {
  GET: {
    ONBOARDING: `${actionTypePrefix}ONBOARDING`,
    ONBOARDING_SUCCESS: `${actionTypePrefix}ONBOARDING_SUCCESS`,
    ONBOARDING_FAILURE: `${actionTypePrefix}ONBOARDING_FAILURE`,
    ROLES: `${actionTypePrefix}ROLES`,
    ROLES_SUCCESS: `${actionTypePrefix}ROLES_SUCCESS`,
    ROLES_FAILURE: `${actionTypePrefix}ROLES_FAILURE`,
    VISITS: `${actionTypePrefix}VISITS`,
    VISITS_SUCCESS: `${actionTypePrefix}VISITS_SUCCESS`,
    VISITS_FAILURE: `${actionTypePrefix}VISITS_FAILURE`,
    VISIT_DETAIL: `${actionTypePrefix}VISIT_DETAIL`,
    VISIT_DETAIL_SUCCESS: `${actionTypePrefix}VISIT_DETAIL_SUCCESS`,
    VISIT_DETAIL_FAILURE: `${actionTypePrefix}VISIT_DETAIL_FAILURE`,
    REJECTION_REASON: `${actionTypePrefix}REJECTION_REASON`,
    REJECTION_REASON_SUCCESS: `${actionTypePrefix}REJECTION_REASON_SUCCESS`,
    REJECTION_REASON_FAILURE: `${actionTypePrefix}REJECTION_REASON_FAILURE`,
    FEEDBACK: `${actionTypePrefix}FEEDBACK`,
    FEEDBACK_SUCCESS: `${actionTypePrefix}FEEDBACK_SUCCESS`,
    FEEDBACK_FAILURE: `${actionTypePrefix}FEEDBACK_FAILURE`,
  },
  SET: {
    SELECTED_ROLE: `${actionTypePrefix}SELECTED_ROLE`,
    WORK_LOCATION: `${actionTypePrefix}WORK_LOCATION`,
  },
  CLEAR: {
    FEEDBACK_DATA: `${actionTypePrefix}FEEDBACK_DATA`,
  },
};

const getOnBoardingData = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ONBOARDING,
});

const getOnBoardingDataSuccess = (payload: OnBoarding[]): IFluxStandardAction<IOnBoarding[]> => ({
  type: FFMActionTypes.GET.ONBOARDING_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getOnBoardingDataFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ONBOARDING_FAILURE,
});

const getRoles = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ROLES,
});

const getRolesSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FFMActionTypes.GET.ROLES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getRolesFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ROLES_FAILURE,
});

const setSelectedRole = (role: Unit): IFluxStandardAction<Unit> => ({
  type: FFMActionTypes.SET.SELECTED_ROLE,
  payload: role,
});

const setWorkLocations = (payload: IWorkLocation[]): IFluxStandardAction<IWorkLocation[]> => ({
  type: FFMActionTypes.SET.WORK_LOCATION,
  payload,
});

const getVisits = (payload?: IFFMVisitParam): IFluxStandardAction<IFFMVisitParam> => ({
  type: FFMActionTypes.GET.VISITS,
  payload,
});

const getVisitsSuccess = (payload: FFMVisit[]): IFluxStandardAction<IFFMVisit[]> => ({
  type: FFMActionTypes.GET.VISITS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getVisitsFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.VISITS_FAILURE,
});

const getVisitDetail = (visitId: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.VISIT_DETAIL,
  payload: visitId,
});

const getVisitDetailSuccess = (payload: FFMVisit): IFluxStandardAction<IFFMVisit> => {
  return {
    type: FFMActionTypes.GET.VISIT_DETAIL_SUCCESS,
    payload: ObjectMapper.serialize(payload),
  };
};

const getVisitDetailFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.VISIT_DETAIL_FAILURE,
});

const getRejectionReasons = (payload: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.REJECTION_REASON,
  payload,
});

const getRejectionReasonsSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FFMActionTypes.GET.REJECTION_REASON_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getRejectionReasonsFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.REJECTION_REASON_FAILURE,
});

const getFeedback = (payload: IGetFeedbackParam): IFluxStandardAction<IGetFeedbackParam> => ({
  type: FFMActionTypes.GET.FEEDBACK,
  payload,
});

const getFeedbackSuccess = (payload: Feedback): IFluxStandardAction<IFeedback> => ({
  type: FFMActionTypes.GET.FEEDBACK_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getFeedbackFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.FEEDBACK_FAILURE,
});

const clearFeedbackData = (): IFluxStandardAction => ({
  type: FFMActionTypes.CLEAR.FEEDBACK_DATA,
});

export type FFMActionPayloadTypes =
  | string
  | number
  | IUnit[]
  | IOnBoarding[]
  | Unit
  | IWorkLocation[]
  | FFMVisit[]
  | IFFMVisit[]
  | IFFMVisitParam
  | IFFMVisit
  | IFeedback;

export const FFMActions = {
  getOnBoardingData,
  getOnBoardingDataSuccess,
  getOnBoardingDataFailure,
  getRoles,
  getRolesSuccess,
  getRolesFailure,
  setSelectedRole,
  setWorkLocations,
  getVisits,
  getVisitsSuccess,
  getVisitsFailure,
  getVisitDetail,
  getVisitDetailSuccess,
  getVisitDetailFailure,
  getRejectionReasons,
  getRejectionReasonsSuccess,
  getRejectionReasonsFailure,
  getFeedback,
  getFeedbackSuccess,
  getFeedbackFailure,
  clearFeedbackData,
};
