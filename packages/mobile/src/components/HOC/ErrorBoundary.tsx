import React, { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ScrollView, View, StyleSheet } from 'react-native';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  children: ReactNode;
}

interface IErrorState {
  hasError: boolean;
}
interface IState {
  error: Error;
  errorInfo: ErrorInfo;
}

type Props = IProps & WithTranslation;

class ErrorBoundary extends Component<Props, IState> {
  public state: IState & IErrorState = {
    hasError: false,
    error: {
      name: '',
      message: '',
      stack: '',
    },
    errorInfo: {
      componentStack: '',
    },
  };

  public static getDerivedStateFromError(): IErrorState {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  // eslint-disable-next-line react/sort-comp
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
  }

  public render(): ReactNode {
    const { hasError, errorInfo, error } = this.state;
    const { children, t } = this.props;
    const isDebug = ConfigHelper.getAppMode() === AppModes.DEBUG;

    if (hasError) {
      return (
        <View style={styles.container}>
          <Icon name={icons.filledWarning} size={80} color={theme.colors.warning} />
          <Text>{t('common:genericErrorMessage')}</Text>
          {isDebug && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.message}>
                {error.message}
                {errorInfo.componentStack}
              </Text>
            </ScrollView>
          )}
        </View>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    marginHorizontal: 20,
  },
  message: {
    marginVertical: 10,
  },
});
