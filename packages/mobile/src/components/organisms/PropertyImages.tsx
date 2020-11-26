import React from 'react';
import { StyleSheet, View, FlatList, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { findIndex, cloneDeep } from 'lodash';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { AttachmentService, AttachmentType } from '@homzhub/common/src/services/AttachmentService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImageThumbnail } from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { AddYoutubeUrl } from '@homzhub/mobile/src/components/molecules/AddYoutubeUrl';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { IPropertyImagesPostPayload, IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IPropertySelectedImages, IYoutubeResponse } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';

interface IProps {
  propertyId: number;
  onPressContinue: () => void;
  lastVisitedStep: ILastVisitedStep;
  containerStyle?: StyleProp<ViewStyle>;
}

type Props = WithTranslation & IProps;

interface IPropertyImagesState {
  selectedImages: AssetGallery[];
  isBottomSheetVisible: boolean;
  isVideoToggled: boolean;
  videoUrl: string;
  isSortImage: boolean;
}

class PropertyImages extends React.PureComponent<Props, IPropertyImagesState> {
  public state = {
    selectedImages: [],
    isBottomSheetVisible: false,
    isVideoToggled: false,
    videoUrl: '',
    isSortImage: true,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public render(): React.ReactNode {
    const { t, containerStyle } = this.props;
    const { selectedImages, isBottomSheetVisible } = this.state;
    const header = selectedImages.length > 0 ? t('property:addMore') : t('property:addPhotos');
    return (
      <>
        <View style={containerStyle}>
          <AssetListingSection title={t('property:images')}>
            <>
              <UploadBox
                icon={icons.gallery}
                header={header}
                subHeader={t('property:supportedImageFormats')}
                onPress={this.onPhotosUpload}
              />
              {this.renderImages()}
            </>
          </AssetListingSection>
          <>{this.renderVideo()}</>
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.buttonStyle}
            onPress={this.postAttachmentsForProperty}
          />
        </View>
        <BottomSheet
          isShadowView
          sheetHeight={650}
          headerTitle={t('property:propertyImages')}
          visible={isBottomSheetVisible}
          onCloseSheet={this.onCloseBottomSheet}
        >
          <ScrollView style={styles.scrollView}>{this.renderBottomSheetForPropertyImages()}</ScrollView>
        </BottomSheet>
      </>
    );
  }

  public renderImages = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedImages } = this.state;
    if (selectedImages.length === 0) {
      return null;
    }
    return (
      <>
        <View style={styles.uploadImageContainer}>
          <Text type="small" textType="semiBold" style={styles.uploadImageText}>
            {t('property:uploadedImages')}
          </Text>
          <Icon name={icons.noteBook} size={23} color={theme.colors.blue} onPress={this.onToggleBottomSheet} />
        </View>
        <View>{this.renderImageThumbnails()}</View>
      </>
    );
  };

  public renderImageThumbnails = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedImages } = this.state;
    const coverPhoto: React.ReactNode[] = [];
    if (selectedImages.length <= 0) {
      return null;
    }
    const coverImageIndex = findIndex(selectedImages, (image: AssetGallery) => {
      return image.isCoverImage;
    });
    const currentImage: AssetGallery = coverImageIndex !== -1 ? selectedImages[coverImageIndex] : selectedImages[0];
    coverPhoto.push(
      <ImageThumbnail
        imageUrl={currentImage.link}
        isIconVisible={false}
        isFavorite
        coverPhotoTitle={t('property:coverPhoto')}
        isCoverPhotoContainer
      />
    );
    return (
      <>
        {coverPhoto}
        <FlatList
          data={selectedImages.slice(1, 7)}
          numColumns={2}
          renderItem={this.renderImagesList}
          keyExtractor={this.renderKeyExtractor}
          testID="ftlistRenderItem"
        />
      </>
    );
  };

  private renderImagesList = ({ item, index }: { item: AssetGallery; index: number }): React.ReactElement => {
    const { selectedImages } = this.state;
    const extraDataLength = selectedImages.length > 6 ? selectedImages.length - 7 : selectedImages.length;
    const isLastThumbnail = index === 5 && extraDataLength > 0;
    const onPressLastThumbnail = (): void => this.onToggleBottomSheet();
    return (
      <ImageThumbnail
        imageUrl={item.link}
        key={`container-${index}`}
        isIconVisible={false}
        isLastThumbnail={isLastThumbnail}
        dataLength={extraDataLength}
        onPressLastThumbnail={onPressLastThumbnail}
        containerStyle={styles.thumbnailContainer}
        imageWrapperStyle={styles.imageWrapper}
      />
    );
  };

  public renderBottomSheetForPropertyImages = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedImages, isSortImage } = this.state;
    // Sort the images with cover image as first object and then the rest
    if (isSortImage) {
      selectedImages.sort((a, b) => {
        // @ts-ignore
        return b.isCoverImage - a.isCoverImage;
      });
    }
    return selectedImages.map((currentImage: AssetGallery, index: number) => {
      const deletePropertyImage = async (): Promise<void> => await this.deletePropertyImage(currentImage);
      const markFavorite = async (): Promise<void> => await this.markAttachmentAsCoverImage(currentImage);
      return (
        <ImageThumbnail
          imageUrl={currentImage.link}
          key={index}
          coverPhotoTitle={currentImage.isCoverImage ? t('property:coverPhoto') : t('property:addCoverPhoto')}
          isCoverPhotoContainer
          isIconVisible
          isFavorite={currentImage.isCoverImage}
          markFavorite={markFavorite}
          containerStyle={styles.bottomSheetContainer}
          onIconPress={deletePropertyImage}
        />
      );
    });
  };

  public renderVideo = (): React.ReactElement => {
    const { isVideoToggled, videoUrl } = this.state;
    const onToggleVideo = (): void => this.setState({ isVideoToggled: !isVideoToggled });
    const onUpdateVideoUrl = (url: string): void => this.setState({ videoUrl: url });
    return (
      <AddYoutubeUrl
        isToggled={isVideoToggled}
        videoUrl={videoUrl}
        onToggle={onToggleVideo}
        onUpdateUrl={onUpdateVideoUrl}
        containerStyle={styles.videoContainer}
      />
    );
  };

  private renderKeyExtractor = (item: AssetGallery, index: number): string => {
    const { id } = item;
    return `${id}-${index}`;
  };

  public onPhotosUpload = async (): Promise<void> => {
    const { propertyId } = this.props;
    const { selectedImages } = this.state;

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
            asset: propertyId,
            attachment: data[index].id,
            link: data[index].link,
            file_name: 'localImage',
            isLocalImage: true,
          });
        });
        if (selectedImages.length === 0) {
          localSelectedImages[0].is_cover_image = true;
        }
        this.setState({
          // @ts-ignore
          selectedImages: selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages)),
        });
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public onToggleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible, isSortImage: true });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false, isSortImage: true });
  };

  public deletePropertyImage = async (selectedImage: AssetGallery): Promise<void> => {
    const { propertyId } = this.props;
    const { selectedImages } = this.state;
    const clonedSelectedImages: AssetGallery[] = cloneDeep(selectedImages);
    if (selectedImage.isLocalImage) {
      const localImageIndex = findIndex(selectedImages, (image: AssetGallery) => {
        return selectedImage.attachment === image.attachment;
      });
      clonedSelectedImages.splice(localImageIndex, 1);
      const coverImageIndex = findIndex(clonedSelectedImages, (image: AssetGallery) => {
        return image.isCoverImage;
      });
      if (coverImageIndex === -1 && clonedSelectedImages.length > 0) {
        clonedSelectedImages[0].isCoverImage = true;
      }
      this.setState({ selectedImages: clonedSelectedImages });
      return;
    }
    await AssetRepository.deletePropertyImage(selectedImage.attachment);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<void> => {
    try {
      const response: AssetGallery[] = await AssetRepository.getPropertyImagesByPropertyId(propertyId);
      const coverImageIndex = findIndex(response, (image: AssetGallery) => {
        return image.isCoverImage;
      });
      if (coverImageIndex === -1 && response.length > 0) {
        response[0].isCoverImage = true;
      }
      this.setState({
        selectedImages: response,
      });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public markAttachmentAsCoverImage = async (selectedImage: AssetGallery): Promise<void> => {
    const { propertyId } = this.props;
    const { selectedImages } = this.state;
    const clonedSelectedImages: AssetGallery[] = cloneDeep(selectedImages);
    if (!selectedImage.id) {
      const existingCoverImageIndex = findIndex(selectedImages, (image: AssetGallery) => {
        return image.isCoverImage;
      });
      clonedSelectedImages[existingCoverImageIndex].isCoverImage = false;
      const newCoverImageIndex = findIndex(selectedImages, (image: AssetGallery) => {
        return selectedImage.attachment === image.attachment;
      });
      clonedSelectedImages[newCoverImageIndex].isCoverImage = true;
      this.setState({
        selectedImages: clonedSelectedImages,
        isSortImage: false,
      });
      return;
    }
    await AssetRepository.markAttachmentAsCoverImage(propertyId, selectedImage.id);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public postAttachmentsForProperty = async (): Promise<void> => {
    const { propertyId, onPressContinue, lastVisitedStep, t } = this.props;
    const { selectedImages, isVideoToggled, videoUrl } = this.state;
    const attachmentIds: IPropertyImagesPostPayload[] = [];
    selectedImages.forEach((selectedImage: AssetGallery) =>
      attachmentIds.push({ attachment: selectedImage.attachment, is_cover_image: selectedImage.isCoverImage })
    );
    if (isVideoToggled && !!videoUrl) {
      const payload = [{ link: videoUrl }];
      try {
        const urlResponse: IYoutubeResponse[] = await AssetRepository.postAttachmentUpload(payload);
        attachmentIds.push({ attachment: urlResponse[0].id, is_cover_image: false });
      } catch (e) {
        AlertHelper.error({ message: t('property:validVideoUrl') });
        return;
      }
    }

    const updateAssetPayload: IUpdateAssetParams = {
      last_visited_step: {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_gallery_done: true,
          total_step: 4,
        },
      },
    };
    try {
      await AssetRepository.postAttachmentsForProperty(propertyId, attachmentIds);
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      onPressContinue();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation()(PropertyImages);

const styles = StyleSheet.create({
  uploadImageContainer: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  uploadImageText: {
    color: theme.colors.darkTint4,
    justifyContent: 'flex-start',
  },
  thumbnailContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  imageWrapper: {
    height: 100,
  },
  scrollView: {
    flex: 1,
  },
  buttonStyle: {
    flex: 0,
    marginBottom: 20,
  },
  bottomSheetContainer: {
    margin: theme.layout.screenPadding,
  },
  videoContainer: {
    marginVertical: 20,
  },
});
