import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IOrderSummaryPayload, IPaymentSuccess } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  valueAddedServices: 'value-added-services/payment/',
  valueAddedServicesPayment: 'value-added-services/payment-response/',
};

class PaymentRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public valueAddedServices = async (payload: IOrderSummaryPayload): Promise<Payment> => {
    const response = await this.apiClient.post(ENDPOINTS.valueAddedServices, payload);
    return ObjectMapper.deserialize(Payment, response);
  };

  public valueAddedServicesPayment = async (paymentDetails: IPaymentSuccess): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.valueAddedServicesPayment, paymentDetails);
  };
}

const paymentRepository = new PaymentRepository();
export { paymentRepository as PaymentRepository };
