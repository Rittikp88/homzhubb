import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { InitiatePropertyListData } from '@homzhub/common/src/mocks/InitiatePropertyListing';
import { Label, Text } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListDetails>;
type Props = libraryProps;

interface IState {
  listing: any;
}

class ServiceListDetails extends React.PureComponent<Props, IState> {
  public state = {
    listing: InitiatePropertyListData,
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const {
      listing: { name },
    } = this.state;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
          iconColor="white"
          iconStyle={styles.iconStyle}
          onIconPress={this.navigateBack}
          isHeadingVisible
          title={t('propertyServices:listProperty')}
          titleType="regular"
          titleFontType="semiBold"
          titleStyle={styles.headerTitle}
        />
        <View style={styles.listing}>
          <Text type="regular" textType="semiBold" style={styles.listingTitle}>
            {name}
          </Text>
          <Label type="large" textType="semiBold" style={styles.label} onPress={this.navigateBack}>
            {t('common:change')}
          </Label>
        </View>
        <View style={styles.initiateService}>
          <Text type="small" textType="semiBold" style={styles.subHeader}>
            {t('propertyServices:subHeader')}
          </Text>
          {this.renderSteps()}
        </View>
      </View>
    );
  }

  public renderSteps(): React.ReactNode {
    const {
      listing: { steps },
    } = this.state;
    return steps.map((step: any, index: number) => {
      // const isLast = steps.length - 1 === index;
      return (
        <>
          <View key={index} style={styles.stepView}>
            <Text type="small" textType="regular" style={styles.stepItem}>
              {index + 1}
            </Text>
            <Text type="regular" textType="regular" style={styles.stepName}>
              {step.name}
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

export default withTranslation()(ServiceListDetails);

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
    alignItems: 'center',
    marginTop: 45,
  },
  stepItem: {
    width: 35,
    height: 35,
    borderColor: theme.colors.darkTint4,
    borderRadius: 35,
    borderWidth: 2,
    textAlign: 'center',
    paddingTop: 5,
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
