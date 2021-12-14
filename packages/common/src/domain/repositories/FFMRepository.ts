import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { OutsetCheck } from '@homzhub/common/src/domain/models/OutsetCheck';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IFFMVisitParam,
  IGetFeedbackParam,
  IOutsetCheckParam,
  IPostFeedback,
  IUpdateReport,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  onBoarding: 'v1/ffm-onboardings',
  roles: 'v1/roles',
  visits: 'v1/ffm/tasks/site-visits/',
  visitDetail: (visitId: number): string => `v1/ffm/tasks/site-visits/${visitId}/`,
  rejectReason: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/reject-reasons/`,
  feedback: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/`,
  feedbackById: (visitId: number, feedbackId: number): string =>
    `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/${feedbackId}`,
  inspectionReport: 'v1/ffm/tasks/inspection-reports/',
  inspectionReportById: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/`,
  outsetsCheck: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/outsets/`,
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

  public getVisitDetail = async (visitId: number): Promise<FFMVisit> => {
    const response = await this.apiClient.get(ENDPOINTS.visitDetail(visitId));
    return ObjectMapper.deserialize(FFMVisit, response);
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

  public getInspectionReport = async (payload: string): Promise<InspectionReport> => {
    const response = await this.apiClient.get(ENDPOINTS.inspectionReport, { status_category: payload });
    return ObjectMapper.deserialize(InspectionReport, response);
  };

  public updateInspectionReport = async (payload: IUpdateReport): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.inspectionReportById(payload.reportId), {
      status: payload.status,
    });
  };

  public outsetsCheck = async (payload: IOutsetCheckParam): Promise<OutsetCheck> => {
    const response = await this.apiClient.post(ENDPOINTS.outsetsCheck(payload.reportId), payload.body);
    return ObjectMapper.deserialize(OutsetCheck, response);
  };
}

const ffmRepository = new FFMRepository();
export { ffmRepository as FFMRepository };
