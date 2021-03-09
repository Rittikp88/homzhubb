/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { TicketActions, TicketActionTypes } from '@homzhub/common/src/modules/tickets/actions';

export function* getUserTickets() {
  try {
    const response = yield call(TicketRepository.getTickets);
    yield put(TicketActions.getTicketsSuccess(response));
  } catch (e) {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* watchTicket() {
  yield takeEvery(TicketActionTypes.GET.GET_TICKETS, getUserTickets);
}
