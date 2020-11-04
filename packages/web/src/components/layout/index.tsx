import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { MainRouter } from '@homzhub/web/src/router/MainRouter';
import Footer from '@homzhub/web/src/components/layout/components/Footer';

class Layout extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <MainRouter />
        </View>
        <Footer />
      </View>
    );
  }
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    width: '90vw',
    margin: '0 auto 0 auto',
    maxWidth: '1280px',
    minHeight: '80vh',
  },
});
