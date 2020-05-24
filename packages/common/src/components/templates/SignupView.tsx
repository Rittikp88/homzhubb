import React from 'react';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { SignUpForm } from '@homzhub/common/src/components/organisms/SignUpForm';
import { SocialMediaComponent } from '@homzhub/common/src/components/organisms/SocialMediaComponent';

interface IProps {
  socialMediaItems: Array<any>;
  onSubmitForm: (payload: ISignUpPayload, ref: FormTextInput | null) => void;
  onSocialSignUpSuccess: (response: any) => void;
}

export const SignupView = ({ socialMediaItems, onSocialSignUpSuccess, onSubmitForm }: IProps): React.ReactElement => {
  return (
    <>
      <SignUpForm onSubmitFormSuccess={onSubmitForm} />
      <SocialMediaComponent socialMediaItems={socialMediaItems} onSuccess={onSocialSignUpSuccess} />
    </>
  );
};
