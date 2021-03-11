/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { TicketActions, TicketActionTypes } from '@homzhub/common/src/modules/tickets/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';

export function* getUserTickets(action: IFluxStandardAction<IGetTicketParam>) {
  try {
    const response = yield call(TicketRepository.getTickets, action.payload as IGetTicketParam);
    yield put(TicketActions.getTicketsSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* getTicketDetails(action: IFluxStandardAction<number>) {
  try {
    const { payload } = action;
    const response = yield call(TicketRepository.getTicketDetail, payload as number);
    yield put(TicketActions.getTicketDetailSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* watchTicket() {
  yield takeEvery(TicketActionTypes.GET.TICKETS, getUserTickets);
  yield takeEvery(TicketActionTypes.GET.TICKET_DETAIL, getTicketDetails);
}
