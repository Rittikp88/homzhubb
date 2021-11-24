import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IOnBoarding, OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
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

export type FFMActionPayloadTypes = IUnit[] | IOnBoarding[];

export const FFMActions = {
  getOnBoardingData,
  getOnBoardingDataSuccess,
  getOnBoardingDataFailure,
  getRoles,
  getRolesSuccess,
  getRolesFailure,
};
