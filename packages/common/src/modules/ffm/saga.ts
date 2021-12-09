/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { IFFMVisitParam, IGetFeedbackParam } from '@homzhub/common/src/domain/repositories/interfaces';

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

export function* getInspectionReports(): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getInspectionReport);
    yield put(FFMActions.getInspectionReportSuccess(response as InspectionReport));
  } catch (e) {
    yield put(FFMActions.getInspectionReportFailure());
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
}
