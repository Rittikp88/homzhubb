import { IOnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

export interface IFFMState {
  onBoardingData: IOnBoarding[];
  roles: IUnit[];
  loaders: {
    onBoarding: boolean;
    roles: boolean;
  };
}
