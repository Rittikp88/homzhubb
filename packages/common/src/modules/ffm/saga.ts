/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMTicket } from '@homzhub/common/src/domain/models/FFMTicket';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { SpaceDetail } from '@homzhub/common/src/domain/models/SpaceDetail';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { ILocalSpaceUpdatePayload } from '@homzhub/common/src/modules/ffm/interface';
import {
  IFFMVisitParam,
  IGetFeedbackParam,
  IGetSpaceDetail,
  IGetTicket,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

export function* getOnBoardingData(): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getOnBoarding);
    yield put(FFMActions.getOnBoardingDataSuccess(response as OnBoarding[]));
  } catch (e) {
    yield put(FFMActions.getOnBoardingDataFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getRoles(): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getRoles);
    yield put(FFMActions.getRolesSuccess(response as Unit[]));
  } catch (e) {
    yield put(FFMActions.getRolesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getVisits(action: IFluxStandardAction<IFFMVisitParam>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getVisits, action.payload);
    yield put(FFMActions.getVisitsSuccess(response as FFMVisit[]));
  } catch (e) {
    yield put(FFMActions.getVisitsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getVisitDetail(action: IFluxStandardAction<number>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getVisitDetail, action.payload as number);
    yield put(FFMActions.getVisitDetailSuccess(response as FFMVisit));
  } catch (e) {
    yield put(FFMActions.getVisitDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}
export function* getRejectionReason(action: IFluxStandardAction<number>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getRejectReason, action.payload as number);
    yield put(FFMActions.getRejectionReasonsSuccess(response as Unit[]));
  } catch (e) {
    yield put(FFMActions.getRejectionReasonsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getFeedbackById(action: IFluxStandardAction<IGetFeedbackParam>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getFeedbackById, action.payload as IGetFeedbackParam);
    yield put(FFMActions.getFeedbackSuccess(response as Feedback));
  } catch (e) {
    yield put(FFMActions.getFeedbackFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getInspectionReports(action: IFluxStandardAction<string>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getInspectionReport, action.payload as string);
    yield put(FFMActions.getInspectionReportSuccess(response as InspectionReport));
  } catch (e) {
    yield put(FFMActions.getInspectionReportFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getReportSpaces(action: IFluxStandardAction<number>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getReportSpaces, action.payload as number);
    yield put(FFMActions.getReportSpaceSuccess(response as ReportSpace[]));
  } catch (e) {
    yield put(FFMActions.getReportSpaceFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getSpaceDetail(action: IFluxStandardAction<IGetSpaceDetail>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getSpaceDetail, action.payload as IGetSpaceDetail);
    const { reportSpaceUnits, spaceInspection } = response as SpaceDetail;
    const formattedData: ILocalSpaceUpdatePayload = {
      condition_of_space: spaceInspection?.conditionOfSpace,
      comments: spaceInspection?.comments,
      attachments: spaceInspection?.spaceInspectionAttachments,
      space_inspection_units: reportSpaceUnits.map((item) => {
        return {
          id: item.spaceInspection?.id,
          name: item.name,
          comments: item.spaceInspection?.comments,
          condition_of_space: item.spaceInspection?.conditionOfSpace,
          attachments: item.spaceInspection?.spaceInspectionAttachments,
        };
      }),
    };
    yield put(FFMActions.setReportSpaceData(formattedData));
    yield put(FFMActions.getSpaceDetailSuccess());
  } catch (e) {
    yield put(FFMActions.getSpaceDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getHotProperties(action: IFluxStandardAction<Tabs>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getHotProperties, action.payload as Tabs);
    yield put(FFMActions.getHotPropertiesSuccess(response as AssetSearch));
  } catch (e) {
    yield put(FFMActions.getHotPropertiesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getTickets(action: IFluxStandardAction<IGetTicket>): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getTickets, action.payload as IGetTicket);
    yield put(FFMActions.getTicketsSuccess(response as FFMTicket));
  } catch (e) {
    yield put(FFMActions.getTicketsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchFFM() {
  yield takeLatest(FFMActionTypes.GET.ONBOARDING, getOnBoardingData);
  yield takeLatest(FFMActionTypes.GET.ROLES, getRoles);
  yield takeLatest(FFMActionTypes.GET.VISITS, getVisits);
  yield takeLatest(FFMActionTypes.GET.VISIT_DETAIL, getVisitDetail);
  yield takeLatest(FFMActionTypes.GET.REJECTION_REASON, getRejectionReason);
  yield takeLatest(FFMActionTypes.GET.FEEDBACK, getFeedbackById);
  yield takeLatest(FFMActionTypes.GET.INSPECTION_REPORT, getInspectionReports);
  yield takeLatest(FFMActionTypes.GET.REPORT_SPACE, getReportSpaces);
  yield takeLatest(FFMActionTypes.GET.SPACE_DETAIL, getSpaceDetail);
  yield takeLatest(FFMActionTypes.GET.HOT_PROPERTIES, getHotProperties);
  yield takeLatest(FFMActionTypes.GET.TICKETS, getTickets);
}
