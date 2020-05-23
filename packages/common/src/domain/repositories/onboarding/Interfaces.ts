export interface IOnboarding {
  title: string;
  image_url: string;
  description: string;
}

export interface IOnboardingRepository {
  getDetails(): Promise<IOnboarding[]>;
}
