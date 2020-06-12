export enum SocialMediaKeys {
  Google = 'GOOGLE',
  Facebook = 'FACEBOOK',
  LinkedIn = 'LINKEDIN',
}

export interface ISocialUserData {
  provider: SocialMediaKeys;
  idToken: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}
