import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IFFMState } from '@homzhub/common/src/modules/ffm/interface';

const getFFMLoaders = (state: IState): IFFMState['loaders'] => {
  return state.ffm.loaders;
};

const getOnBoardingData = (state: IState): OnBoarding[] => {
  const {
    ffm: { onBoardingData },
  } = state;
  if (onBoardingData.length < 1) return [];
  return ObjectMapper.deserializeArray(OnBoarding, onBoardingData);
};

const getRoles = (state: IState): Unit[] => {
  const {
    ffm: { roles },
  } = state;
  if (roles.length < 1) return [];
  return ObjectMapper.deserializeArray(Unit, roles);
};

const getSelectedRole = (state: IState): Unit | null => {
  const {
    ffm: { selectedRole },
  } = state;
  return selectedRole;
};

const getWorkLocations = (state: IState): IWorkLocation[] => {
  const {
    ffm: { workLocations },
  } = state;
  return workLocations;
};

const getVisits = (state: IState): FFMVisit[] => {
  const {
    ffm: { visits },
  } = state;
  if (visits.length < 1) return [];
  return ObjectMapper.deserializeArray(FFMVisit, visits);
};

const getRejectionReason = (state: IState): IDropdownOption[] => {
  const {
    ffm: { reasons },
  } = state;

  const deserializedData = ObjectMapper.deserializeArray(Unit, reasons);

  return deserializedData.map((item) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
};

const getFeedback = (state: IState): Feedback | null => {
  const {
    ffm: { feedback },
  } = state;
  if (!feedback) return null;
  return ObjectMapper.deserialize(Feedback, feedback);
};

export const FFMSelector = {
  getFFMLoaders,
  getOnBoardingData,
  getRoles,
  getSelectedRole,
  getWorkLocations,
  getVisits,
  getRejectionReason,
  getFeedback,
};
