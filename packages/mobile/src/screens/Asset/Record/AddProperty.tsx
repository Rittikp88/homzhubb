import React, { PureComponent, ReactElement, ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/mobile/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IPropertySelectedImages } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IScreenState {
  currentIndex: number;
  isNextStep: boolean;
  heights: number[];
}

interface IStateProps {
  assetId: number;
  selectedImages: AssetGallery[];
}

interface IDispatchProps {
  getAssetById: () => void;
  resetState: () => void;
  setSelectedImages: (payload: AssetGallery[]) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AddProperty>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AddProperty extends PureComponent<Props, IScreenState> {
  private scrollRef = React.createRef<ScrollView>();

  public componentWillUnmount = (): void => {
    const { navigation, getAssetById } = this.props;
    navigation.removeListener('focus', getAssetById);
  };

  public render = (): ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;

    return (
      <View style={styles.screen}>
        <Header icon={icons.leftArrow} title={t('property:addProperty')} onIconPress={this.goBack} />
        <KeyboardAvoidingView style={styles.screen} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
            <AddPropertyView
              onUploadImage={this.onPhotosUpload}
              onEditPress={this.onEditPress}
              scrollToTop={this.scrollToTop}
              previousScreen={params?.previousScreen}
              onNavigateToPlanSelection={this.handleNavigationToPlan}
              onNavigateToDetail={this.handleNavigationToDetail}
              renderCarousel={this.renderCarousel}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  private renderCarousel = (
    data: Amenity[][],
    renderItem: (item: Amenity[]) => ReactElement,
    activeSlide: number,
    onSnap: (slideNumber: number) => void
  ): ReactElement => {
    return (
      <>
        <SnapCarousel
          carouselData={data}
          carouselItem={renderItem}
          activeIndex={activeSlide}
          onSnapToItem={onSnap}
          containerStyle={styles.carouselContainer}
        />
        <PaginationComponent
          containerStyle={styles.pagination}
          dotsLength={data.length}
          activeSlide={activeSlide}
          activeDotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
        />
      </>
    );
  };

  public onPhotosUpload = async (): Promise<void> => {
    const { assetId, setSelectedImages, selectedImages } = this.props;

    try {
      // @ts-ignore
      const images: ImagePickerResponse[] = await ImagePicker.openPicker({
        multiple: true,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('files[]', {
          // @ts-ignore
          name: PlatformUtils.isIOS() ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1),
          uri: image.path,
          type: image.mime,
        });
      });

      try {
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_IMAGE);

        const { data } = response;
        const localSelectedImages: IPropertySelectedImages[] = [];
        images.forEach((image, index: number) => {
          localSelectedImages.push({
            id: null,
            description: '',
            is_cover_image: false,
            asset: assetId,
            attachment: data[index].id,
            link: data[index].link,
            file_name: 'localImage',
            isLocalImage: true,
          });
        });
        if (selectedImages.length === 0) {
          localSelectedImages[0].is_cover_image = true;
        }
        setSelectedImages(selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages)));
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private onEditPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PostAssetDetails);
  };

  private goBack = (): void => {
    const {
      navigation,
      route: { params },
      resetState,
    } = this.props;

    if (params && params.previousScreen === ScreensKeys.Dashboard) {
      resetState();
    }

    navigation.goBack();
  };

  private handleNavigationToPlan = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AssetPlanSelection);
  };

  private handleNavigationToDetail = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyDetailScreen);
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentAssetId, getSelectedImages } = RecordAssetSelectors;

  return {
    assetId: getCurrentAssetId(state),
    selectedImages: getSelectedImages(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState, setSelectedImages } = RecordAssetActions;
  return bindActionCreators({ getAssetById, resetState, setSelectedImages }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddProperty));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  activeDot: {
    borderWidth: 1,
  },
  inactiveDot: {
    backgroundColor: theme.colors.darkTint10,
    borderWidth: 0,
  },
  pagination: {
    paddingVertical: 0,
  },
  carouselContainer: {
    alignSelf: 'center',
  },
});
