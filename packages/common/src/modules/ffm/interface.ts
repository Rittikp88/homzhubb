import { IFeedback } from '@homzhub/common/src/domain/models/Feedback';
import { IFFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IInspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { IOnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';

export interface IFFMState {
  onBoardingData: IOnBoarding[];
  roles: IUnit[];
  reasons: IUnit[];
  selectedRole: Unit | null;
  workLocations: IWorkLocation[];
  visits: IFFMVisit[];
  visitDetail: IFFMVisit | null;
  feedback: IFeedback | null;
  inspectionReport: IInspectionReport | null;
  loaders: {
    onBoarding: boolean;
    roles: boolean;
    visits: boolean;
    visitDetail: boolean;
    reasons: boolean;
    feedback: boolean;
    inspectionReport: boolean;
  };
}
