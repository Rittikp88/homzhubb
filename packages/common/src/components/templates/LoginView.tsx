import React from 'react';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { SocialMediaComponent } from '@homzhub/common/src/components/organisms/SocialMediaComponent';

interface ILoginProps {
  onEmailLogin: () => void;
  socialMediaItems: Array<any>;
  onSocialLoginSuccess: (response: any) => void;
  handleLoginSuccess: (payload: ILoginFormData) => void;
}

export class LoginView extends React.PureComponent<ILoginProps, {}> {
  public render(): React.ReactNode {
    const { onEmailLogin, socialMediaItems, onSocialLoginSuccess, handleLoginSuccess } = this.props;
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <SocialMediaComponent
          socialMediaItems={socialMediaItems}
          onSuccess={onSocialLoginSuccess}
          onEmailLogin={onEmailLogin}
          isFromLogin
        />
      </>
    );
  }
}
