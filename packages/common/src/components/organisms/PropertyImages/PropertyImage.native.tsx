import React from 'react';
import { FlatList, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { cloneDeep, findIndex } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ImageThumbnail from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AddYoutubeUrl } from '@homzhub/common/src/components/molecules/AddYoutubeUrl';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IYoutubeResponse } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IPropertyImagesPostPayload, IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  propertyId: number;
  onPressContinue: () => void;
  onUploadImage: (files?: File[]) => void;
  selectedImages: AssetGallery[];
  lastVisitedStep: ILastVisitedStep;
  containerStyle?: StyleProp<ViewStyle>;
  setSelectedImages: (payload: AssetGallery[]) => void;
}

type Props = WithTranslation & IProps;

interface IPropertyImagesState {
  isBottomSheetVisible: boolean;
  isVideoToggled: boolean;
  videoUrl: string;
  isSortImage: boolean;
}

class PropertyImages extends React.PureComponent<Props, IPropertyImagesState> {
  public state = {
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
    const { t, onUploadImage, selectedImages } = this.props;
    const { isBottomSheetVisible, videoUrl } = this.state;
    const header = selectedImages.length > 0 ? t('property:addMore') : t('property:addPhotos');

    return (
      <>
        <View style={styles.container}>
          <AssetListingSection title={t('property:images')}>
            <>
              <UploadBox
                icon={icons.gallery}
                header={header}
                subHeader={t('property:supportedImageFormats')}
                onPress={onUploadImage}
              />
              {this.renderImages()}
            </>
          </AssetListingSection>
          {this.renderVideo()}
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.buttonStyle}
            onPress={this.postAttachmentsForProperty}
            disabled={!videoUrl && !selectedImages.length}
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
    const { t, selectedImages } = this.props;
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
    const { t, selectedImages } = this.props;
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

  public renderBottomSheetForPropertyImages = (): React.ReactNode => {
    const { t, selectedImages } = this.props;
    const { isSortImage } = this.state;
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

  private renderImagesList = ({ item, index }: { item: AssetGallery; index: number }): React.ReactElement => {
    const { selectedImages } = this.props;
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

  private renderKeyExtractor = (item: AssetGallery, index: number): string => {
    const { id } = item;
    return `${id}-${index}`;
  };

  public onToggleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible, isSortImage: true });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false, isSortImage: true });
  };

  public deletePropertyImage = async (selectedImage: AssetGallery): Promise<void> => {
    const { propertyId, selectedImages, setSelectedImages } = this.props;
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
      setSelectedImages(clonedSelectedImages);
      return;
    }
    await AssetRepository.deletePropertyImage(selectedImage.attachment);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<void> => {
    const { setSelectedImages } = this.props;
    if (propertyId < 1) return;
    try {
      const response: AssetGallery[] = await AssetRepository.getPropertyImagesByPropertyId(propertyId);
      const coverImageIndex = findIndex(response, (image: AssetGallery) => {
        return image.isCoverImage;
      });
      if (coverImageIndex === -1 && response.length > 0) {
        response[0].isCoverImage = true;
      }
      setSelectedImages(response);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public markAttachmentAsCoverImage = async (selectedImage: AssetGallery): Promise<void> => {
    const { propertyId, selectedImages, setSelectedImages } = this.props;
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
      setSelectedImages(clonedSelectedImages);
      this.setState({
        isSortImage: false,
      });
      return;
    }
    await AssetRepository.markAttachmentAsCoverImage(propertyId, selectedImage.id);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public postAttachmentsForProperty = async (): Promise<void> => {
    const { propertyId, onPressContinue, lastVisitedStep, t, selectedImages } = this.props;
    const { isVideoToggled, videoUrl } = this.state;
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
  container: {
    marginHorizontal: 16,
  },
  uploadImageContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flex: 0,
  },
  uploadView: {
    flexDirection: 'row',
  },
  section: {
    flex: 1,
    marginRight: 24,
  },
});
