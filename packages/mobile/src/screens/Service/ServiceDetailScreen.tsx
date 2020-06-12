import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ServiceSelector } from '@homzhub/common/src/modules/service/selectors';
import { Button, Label, SVGUri, Text } from '@homzhub/common/src/components';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';
import { AnimatedServiceList } from '@homzhub/mobile/src/components/templates/AnimatedServiceList';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

interface IStateProps {
  services: IServiceDetail[];
}

interface IServiceDetailState {
  isInfoSheet: boolean;
  isConfirmSheet: boolean;
  activeSlide: number;
  ref: any;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceDetailScreen>;
type Props = libraryProps & IStateProps;

class ServiceDetailScreen extends Component<Props, IServiceDetailState> {
  public constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    this.state = {
      isInfoSheet: false,
      isConfirmSheet: false,
      activeSlide: params ? params.index : 0,
      ref: null,
    };
  }

  public render(): React.ReactNode {
    const { services, t } = this.props;
    const { activeSlide } = this.state;
    const activeItem = services.find((item: IServiceDetail) => item.index === activeSlide);
    return (
      <>
        <AnimatedServiceList
          headerTitle={t('services')}
          title={t('pleaseConfirm')}
          titleType="large"
          titleTextType="regular"
          onIconPress={this.handleIconPress}
        >
          <View style={styles.cardView}>
            <View style={styles.cardHeader}>
              <PaginationComponent
                dotsLength={services.length}
                activeSlide={activeSlide}
                containerStyle={styles.pagination}
              />
              {activeItem && activeItem.badge && (
                <Badge
                  title={activeItem.badge}
                  badgeColor={theme.colors.mediumPriority}
                  badgeStyle={styles.badgeStyle}
                />
              )}
            </View>
            <SnapCarousel
              carouselData={services}
              carouselItem={this.renderCarouselItem}
              activeSlide={activeSlide}
              currentSlide={this.changeSlide}
              bubbleRef={this.updateRef}
              contentStyle={styles.carouselStyle}
            />
          </View>
        </AnimatedServiceList>
        {activeItem && this.renderBottomSheet(activeItem.serviceName)}
      </>
    );
  }

  private renderCarouselItem = (item: IServiceDetail): React.ReactElement => {
    return (
      <CardBody
        key={item.index}
        title={item.serviceName}
        isDetailView
        description={item.description}
        serviceCost={item.serviceCost}
        detailedData={item.facilities}
        onPressInfo={this.handleMoreInfo}
        onConfirm={this.onConfirmService}
      />
    );
  };

  private renderBottomSheet = (name: string): React.ReactElement => {
    const { isInfoSheet, isConfirmSheet } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet
        visible={isInfoSheet || isConfirmSheet}
        onCloseSheet={this.closeBottomSheet}
        headerTitle={isInfoSheet ? t('moreInformation') : ''}
        isShadowView={isInfoSheet}
        sheetHeight={500}
      >
        <>{isConfirmSheet && this.renderConfirmationView(name)}</>
      </BottomSheet>
    );
  };

  private renderConfirmationView = (name: string): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.confirmationView}>
        <View style={styles.confirmationContent}>
          <Text type="large" textType="regular" style={styles.confirmationMsg}>
            {t('thankYouMsg', { name })}
          </Text>
          <SVGUri
            width={250}
            height={150}
            viewBox="0 0 250 150"
            preserveAspectRatio="xMidYMid meet"
            uri="https://homzhub-bucket.s3.amazonaws.com/Group+1301.svg"
          />
          <Label type="large" textType="regular" style={styles.info}>
            {t('clickContinue')}
          </Label>
        </View>
        <Button type="primary" title={t('common:continue')} containerStyle={styles.buttonStyle} />
      </View>
    );
  };

  private onConfirmService = (): void => {
    const { isConfirmSheet } = this.state;
    this.setState({ isConfirmSheet: !isConfirmSheet });
  };

  private handleMoreInfo = (): void => {
    const { isInfoSheet } = this.state;
    this.setState({ isInfoSheet: !isInfoSheet });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isInfoSheet: false, isConfirmSheet: false });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private changeSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private updateRef = (ref: any): void => {
    this.setState({ ref });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    services: ServiceSelector.getServiceDetails(state),
  };
};

export default connect<IStateProps, null, WithTranslation, IState>(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.service)(ServiceDetailScreen));

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 8,
    marginVertical: 14,
  },
  badgeStyle: {
    marginBottom: 4,
  },
  pagination: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginHorizontal: 20,
    marginBottom: 18,
    height: 25,
  },
  confirmationView: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  confirmationContent: {
    alignItems: 'center',
  },
  confirmationMsg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    lineHeight: 33,
    color: theme.colors.darkTint1,
  },
  info: {
    marginTop: 20,
    color: theme.colors.darkTint5,
  },
  buttonStyle: {
    flex: 0,
    marginTop: 12,
  },
  carouselStyle: {
    paddingLeft: 0,
    paddingRight: 20,
  },
});
