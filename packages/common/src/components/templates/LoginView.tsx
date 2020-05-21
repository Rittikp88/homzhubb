import React from 'react';
import { Button, LoginForm } from '@homzhub/common/src/components';

interface ILoginProps {
  onEmailLogin: () => void;
}

export class LoginView extends React.PureComponent<ILoginProps, {}> {
  public render(): React.ReactNode {
    const { onEmailLogin } = this.props;
    return (
      <>
        <LoginForm />
        <Button type="primary" title="Email Login" onPress={onEmailLogin} />
      </>
    );
  }
}
