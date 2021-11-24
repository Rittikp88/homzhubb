import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
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

export const FFMSelector = {
  getFFMLoaders,
  getOnBoardingData,
  getRoles,
};
