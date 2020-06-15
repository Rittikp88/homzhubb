import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import { Label, Text } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListSteps>;
type Props = libraryProps;

interface IState {
  listing: any;
}

class ServiceListSteps extends React.PureComponent<Props, IState> {
  public state = {
    listing: ServiceSteps,
  };

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    const { listing } = this.state;
    const listItem = listing.find((item) => item.name === params.name);
    if (!listItem) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
          iconColor="white"
          iconStyle={styles.iconStyle}
          onIconPress={this.navigateBack}
          isHeadingVisible
          title={t('service:listProperty')}
          titleType="regular"
          titleFontType="semiBold"
          titleStyle={styles.headerTitle}
        />
        <View style={styles.listing}>
          <Text type="regular" textType="semiBold" style={styles.listingTitle}>
            {listItem.name}
          </Text>
          <Label type="large" textType="semiBold" style={styles.label} onPress={this.navigateBack}>
            {t('common:change')}
          </Label>
        </View>
        <View style={styles.initiateService}>
          <Text type="small" textType="semiBold" style={styles.subHeader}>
            {t('service:subHeader')}
          </Text>
          {this.renderSteps(listItem.steps)}
        </View>
      </View>
    );
  }

  public renderSteps(steps: any): React.ReactElement {
    return steps.map((stepItem: any, index: number) => {
      // const isLast = steps.length - 1 === index;
      return (
        <>
          <View key={index} style={styles.stepView}>
            <Text type="small" textType="regular" style={styles.stepItem}>
              {index + 1}
            </Text>
            <Text type="regular" textType="regular" style={styles.stepName}>
              {stepItem.name}
            </Text>
          </View>
          {/* {!isLast && <Divider containerStyles={styles.divider} />} */}
        </>
      );
    });
  }

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation()(ServiceListSteps);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  iconStyle: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  listing: {
    flexDirection: 'row',
    margin: theme.layout.screenPadding,
  },
  listingTitle: {
    flex: 1,
  },
  label: {
    color: theme.colors.primaryColor,
  },
  initiateService: {
    margin: theme.layout.screenPadding,
  },
  subHeader: {
    color: theme.colors.darkTint4,
  },
  stepView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45,
  },
  stepItem: {
    width: 35,
    height: 35,
    borderColor: theme.colors.darkTint4,
    borderRadius: 35,
    borderWidth: 2,
    textAlign: 'center',
  },
  // divider: {
  //   borderColor: theme.colors.disabled,
  //   borderWidth: 1,
  //   transform: [{ rotate: '90deg' }],
  // },
  stepName: {
    flex: 1,
    marginLeft: 20,
  },
});
