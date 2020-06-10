import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListScreen>;
type Props = libraryProps;

export class ServiceListScreen extends Component<Props, any> {
  public render(): React.ReactNode {
    return undefined;
  }
}
