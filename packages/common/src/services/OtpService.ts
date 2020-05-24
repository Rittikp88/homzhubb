import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class OtpService {
  public fetchOtp = async (): Promise<void> => {
    await UserRepository.fetchOtp();
  };

  public verifyOtp = async (): Promise<void> => {
    await UserRepository.verifyOtp();
  };
}

const otpService = new OtpService();
export { otpService as OtpService };
