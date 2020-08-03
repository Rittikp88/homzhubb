import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';

class LeadService {
  public postLeadDetail = async (transaction_type: number, payload: ILeadPayload): Promise<void> => {
    if (transaction_type === 0) {
      // RENT FLOW
      await LeadRepository.postLeaseLeadDetail(payload);
    } else {
      // SALE FLOW
      await LeadRepository.postSaleLeadDetail(payload);
    }
  };
}

const leadService = new LeadService();
export { leadService as LeadService };
