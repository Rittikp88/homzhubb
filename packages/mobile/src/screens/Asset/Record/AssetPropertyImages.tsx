import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Header } from '@homzhub/mobile/src/components';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';

interface IStateProps {
  propertyId: number;
}

type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetPropertyImages>;
type Props = WithTranslation & libraryProps & IStateProps;

class AssetPropertyImages extends React.PureComponent<Props> {
  public render(): React.ReactElement {
    const { t, propertyId } = this.props;
    return (
      <>
        <View style={styles.container}>
          <Header
            type="primary"
            icon={icons.leftArrow}
            onIconPress={this.onBackPress}
            isHeadingVisible
            title={t('addPropertyImages')}
            testID="header"
          />
          <PropertyImages
            propertyId={propertyId}
            onPressContinue={this.onContinuePress}
            containerStyle={styles.propertyImagesContainer}
          />
        </View>
      </>
    );
  }

  public onBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public onContinuePress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.RentServicesScreen);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    propertyId: PropertySelector.getCurrentPropertyId(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetPropertyImages));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  propertyImagesContainer: {
    margin: theme.layout.screenPadding,
  },
});
