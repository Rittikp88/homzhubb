import React from 'react';
import { SignUpForm } from '@homzhub/common/src/components/organisms/SignUpForm';
import { SocialMediaComponent } from '@homzhub/common/src/components/organisms/SocialMediaComponent';

interface IProps {
  socialMediaItems: Array<any>;
  onSocialSignUpSuccess: (response: any) => void;
}

export const SignupView = ({ socialMediaItems, onSocialSignUpSuccess }: IProps): React.ReactElement => {
  return (
    <>
      <SignUpForm />
      <SocialMediaComponent socialMediaItems={socialMediaItems} onSuccess={onSocialSignUpSuccess} />
    </>
  );
};
