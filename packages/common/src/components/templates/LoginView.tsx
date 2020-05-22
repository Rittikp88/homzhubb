import React from 'react';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { SocialMediaComponent } from '@homzhub/common/src/components/organisms/SocialMediaComponent';

interface ILoginProps {
  onEmailLogin: () => void;
  socialMediaItems: Array<any>;
  onSocialLoginSuccess: (response: any) => void;
}

export class LoginView extends React.PureComponent<ILoginProps, {}> {
  public render(): React.ReactNode {
    const { onEmailLogin, socialMediaItems, onSocialLoginSuccess } = this.props;
    return (
      <>
        <LoginForm />
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
