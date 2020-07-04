import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { bindActionCreators, Dispatch } from 'redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { Button, Label, SVGUri, Text } from '@homzhub/common/src/components';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';
import { AnimatedServiceList } from '@homzhub/mobile/src/components/templates/AnimatedServiceList';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  setCurrentServiceCategoryId: (id: number) => void;
}

interface IStateProps {
  services: IServiceDetail[];
}

interface IServiceDetailState {
  isInfoSheet: boolean;
  isConfirmSheet: boolean;
  activeSlide: number;
  serviceInfo: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceDetailScreen>;
type Props = libraryProps & IStateProps;

export class ServiceDetailScreen extends Component<Props, IServiceDetailState> {
  public constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    this.state = {
      isInfoSheet: false,
      isConfirmSheet: false,
      activeSlide: params ? params.serviceId : 0,
      serviceInfo: '',
    };
  }

  public render(): React.ReactNode {
    const { services, t } = this.props;
    const { activeSlide } = this.state;
    const activeItem = services.find((item: IServiceDetail, index: number) => index === activeSlide);
    return (
      <>
        <AnimatedServiceList
          headerTitle={t('services')}
          title={t('pleaseConfirm')}
          titleType="large"
          titleTextType="regular"
          onIconPress={this.handleIconPress}
          testID="animatedServiceList"
        >
          <View style={styles.cardView}>
            <View style={styles.cardHeader}>
              <PaginationComponent
                dotsLength={services.length}
                activeSlide={activeSlide}
                containerStyle={styles.pagination}
              />
              {activeItem && activeItem.label && (
                <Badge
                  title={activeItem.label ? t('common:recommended') : ''}
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
              contentStyle={styles.carouselStyle}
              testID="carsl"
            />
          </View>
        </AnimatedServiceList>
        {activeItem && this.renderBottomSheet(activeItem.title, activeItem.id)}
      </>
    );
  }

  private renderCarouselItem = (item: IServiceDetail): React.ReactElement => {
    const onPressIcon = (): void => this.handleMoreInfo(item.info);
    return (
      <CardBody
        key={item.id}
        title={item.title}
        isDetailView
        description={item.description}
        serviceCost={item.service_cost}
        detailedData={item.service_bundle_items}
        onPressInfo={onPressIcon}
        onConfirm={this.onConfirmService}
      />
    );
  };

  private renderBottomSheet = (name: string, id: number): React.ReactElement => {
    const { isInfoSheet, isConfirmSheet } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet
        visible={isInfoSheet || isConfirmSheet}
        onCloseSheet={this.closeBottomSheet}
        headerTitle={isInfoSheet ? t('moreInformation') : ''}
        isShadowView={isInfoSheet}
        sheetHeight={isInfoSheet ? 650 : 500}
      >
        <>
          {isInfoSheet && this.renderMoreInfo()}
          {isConfirmSheet && this.renderConfirmationView(name, id)}
        </>
      </BottomSheet>
    );
  };

  private renderConfirmationView = (name: string, id: number): React.ReactElement => {
    const { t } = this.props;
    const handlePress = (): void => this.onPressContinue(name, id);
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
        <Button type="primary" title={t('common:continue')} containerStyle={styles.buttonStyle} onPress={handlePress} />
      </View>
    );
  };

  private renderMoreInfo = (): React.ReactElement => {
    const { serviceInfo } = this.state;
    return (
      <View style={styles.infoView}>
        <Markdown
          markdownStyles={{
            h2: { fontWeight: '600', fontSize: 20, marginVertical: 10 },
            h4: { fontWeight: '300', fontSize: 24, color: theme.colors.darkTint2 },
            strong: { fontWeight: '600', fontSize: 16 },
            text: { fontWeight: 'normal', fontSize: 14 },
          }}
        >
          {serviceInfo}
        </Markdown>
      </View>
    );
  };

  private onConfirmService = (): void => {
    const { isConfirmSheet } = this.state;
    this.setState({ isConfirmSheet: !isConfirmSheet });
  };

  private onPressContinue = (name: string, id: number): void => {
    // @ts-ignore
    const { navigation, setCurrentServiceCategoryId } = this.props;
    setCurrentServiceCategoryId(id);
    navigation.navigate(ScreensKeys.ServiceListSteps, { id, name });
    this.closeBottomSheet();
  };

  private handleMoreInfo = (info: string): void => {
    const { isInfoSheet } = this.state;
    this.setState({ isInfoSheet: !isInfoSheet, serviceInfo: info });
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
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    services: PropertySelector.getServiceDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentServiceCategoryId } = PropertyActions;
  return bindActionCreators(
    {
      setCurrentServiceCategoryId,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(ServiceDetailScreen));

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
    justifyContent: 'space-around',
  },
  confirmationContent: {
    alignItems: 'center',
  },
  confirmationMsg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    lineHeight: 33,
    color: theme.colors.darkTint1,
    textAlign: 'center',
  },
  info: {
    marginTop: 20,
    color: theme.colors.darkTint5,
  },
  buttonStyle: {
    flex: 0,
    marginTop: 20,
  },
  carouselStyle: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  infoView: {
    paddingHorizontal: 24,
  },
});
