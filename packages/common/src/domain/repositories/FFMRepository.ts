import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IFFMVisitParam, IGetFeedbackParam, IPostFeedback } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  onBoarding: 'v1/ffm-onboardings',
  roles: 'v1/roles',
  visits: 'v1/ffm/tasks/site-visits/',
  rejectReason: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/reject-reasons/`,
  feedback: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/`,
  feedbackById: (visitId: number, feedbackId: number): string =>
    `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/${feedbackId}`,
};

class FFMRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding);
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getRoles = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.roles);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getVisits = async (param?: IFFMVisitParam): Promise<FFMVisit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.visits, param);
    return ObjectMapper.deserializeArray(FFMVisit, response);
  };

  public getRejectReason = async (visitId: number): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.rejectReason(visitId));
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public postFeedback = async (payload: IPostFeedback): Promise<void> => {
    const { visitId, data } = payload;
    return await this.apiClient.post(ENDPOINTS.feedback(visitId), data);
  };

  public getFeedbackById = async (payload: IGetFeedbackParam): Promise<Feedback> => {
    const response = await this.apiClient.get(ENDPOINTS.feedbackById(payload.visitId, payload.feedbackId));
    return ObjectMapper.deserialize(Feedback, response);
  };
}

const ffmRepository = new FFMRepository();
export { ffmRepository as FFMRepository };
