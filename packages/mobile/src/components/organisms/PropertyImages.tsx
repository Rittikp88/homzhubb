import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { findIndex, cloneDeep } from 'lodash';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, ImageThumbnail, Text, UploadBox, WithShadowView } from '@homzhub/common/src/components';
import { AddYoutubeUrl } from '@homzhub/mobile/src/components/molecules/AddYoutubeUrl';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IPropertySelectedImages, IPropertyImagesPostPayload } from '@homzhub/common/src/domain/models/Service';

interface IProps {
  propertyId: number;
  onPressContinue: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

type Props = WithTranslation & IProps;

interface IPropertyImagesState {
  selectedImages: IPropertySelectedImages[];
  isBottomSheetVisible: boolean;
  isVideoToggled: boolean;
  videoUrl: string;
}

class PropertyImages extends React.PureComponent<Props, IPropertyImagesState> {
  public state = {
    selectedImages: [],
    isBottomSheetVisible: false,
    isVideoToggled: false,
    videoUrl: '',
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
        <View style={[styles.container, containerStyle]}>
          <View style={styles.imageContainer}>
            <View style={styles.imageHeader}>
              <Text type="small" textType="semiBold" style={styles.headerText}>
                {t('property:images')}
              </Text>
            </View>
            <View style={styles.uploadContainer}>
              <UploadBox
                icon={icons.gallery}
                header={header}
                subHeader={t('property:supportedImageFormats')}
                onPress={this.onPhotosUpload}
              />
              {this.renderImages()}
            </View>
          </View>
          <>{this.renderVideo()}</>
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
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.buttonStyle}
            onPress={this.postAttachmentsForProperty}
          />
        </WithShadowView>
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
    const coverImageIndex = findIndex(selectedImages, (image: IPropertySelectedImages) => {
      return image.is_cover_image;
    });
    const currentImage: IPropertySelectedImages =
      coverImageIndex !== -1 ? selectedImages[coverImageIndex] : selectedImages[0];
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
        <SafeAreaView>
          <FlatList
            data={selectedImages.slice(1, 7)}
            numColumns={2}
            renderItem={this.renderImagesList}
            keyExtractor={this.renderKeyExtractor}
            testID="ftlistRenderItem"
          />
        </SafeAreaView>
      </>
    );
  };

  private renderImagesList = (data: { item: IPropertySelectedImages; index: number }): React.ReactElement => {
    const { item, index } = data;
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
    const { selectedImages } = this.state;
    // Sort the images with cover image as first object and then the rest
    selectedImages.sort((a, b) => {
      // @ts-ignore
      return b.is_cover_image - a.is_cover_image;
    });
    return selectedImages.map((currentImage: IPropertySelectedImages, index: number) => {
      const deletePropertyImage = async (): Promise<void> => await this.deletePropertyImage(currentImage);
      const markFavorite = async (): Promise<void> => await this.markAttachmentAsCoverImage(currentImage);
      return (
        <ImageThumbnail
          imageUrl={currentImage.link}
          key={index}
          coverPhotoTitle={currentImage.is_cover_image ? t('property:coverPhoto') : t('property:addCoverPhoto')}
          isCoverPhotoContainer
          isIconVisible
          isFavorite={currentImage.is_cover_image}
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

  private renderKeyExtractor = (item: IPropertySelectedImages, index: number): string => {
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
      const baseUrl = ConfigHelper.getBaseUrl();
      const user: IUser | null = await StorageService.get(StorageKeys.USER);
      fetch(`${baseUrl}attachments/upload/`, {
        method: 'POST',
        headers: {
          'content-type': 'multipart/form-data',
          // @ts-ignore
          Authorization: `Bearer ${user.access_token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          const { data } = responseJson;
          const localSelectedImages: IPropertySelectedImages[] = [];
          images.forEach((image, index: number) => {
            localSelectedImages.push({
              id: null,
              description: '',
              is_cover_image: false,
              asset: propertyId,
              attachment: data[index].id,
              link: data[index].link,
              isLocalImage: true,
            });
          });
          if (selectedImages.length === 0) {
            localSelectedImages[0].is_cover_image = true;
          }
          this.setState({
            // @ts-ignore
            selectedImages: selectedImages.concat(localSelectedImages),
          });
        });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public onToggleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  public deletePropertyImage = async (selectedImage: IPropertySelectedImages): Promise<void> => {
    const { propertyId } = this.props;
    const { selectedImages } = this.state;
    const clonedSelectedImages: IPropertySelectedImages[] = cloneDeep(selectedImages);
    if (selectedImage.isLocalImage) {
      const localImageIndex = findIndex(selectedImages, (image: IPropertySelectedImages) => {
        return selectedImage.attachment === image.attachment;
      });
      clonedSelectedImages.splice(localImageIndex, 1);
      const coverImageIndex = findIndex(clonedSelectedImages, (image) => {
        return image.is_cover_image;
      });
      if (coverImageIndex === -1 && clonedSelectedImages.length > 0) {
        clonedSelectedImages[0].is_cover_image = true;
      }
      this.setState({ selectedImages: clonedSelectedImages });
      return;
    }
    await AssetRepository.deletePropertyImage(selectedImage.attachment);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<void> => {
    try {
      const response = await AssetRepository.getPropertyImagesByPropertyId(propertyId);
      const coverImageIndex = findIndex(response, (image) => {
        return image.is_cover_image;
      });
      if (coverImageIndex === -1 && response.length > 0) {
        response[0].is_cover_image = true;
      }
      this.setState({
        selectedImages: response,
      });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public markAttachmentAsCoverImage = async (selectedImage: IPropertySelectedImages): Promise<void> => {
    const { propertyId } = this.props;
    const { selectedImages } = this.state;
    const clonedSelectedImages: IPropertySelectedImages[] = cloneDeep(selectedImages);
    if (!selectedImage.id) {
      const existingCoverImageIndex = findIndex(selectedImages, (image: IPropertySelectedImages) => {
        return image.is_cover_image;
      });
      clonedSelectedImages[existingCoverImageIndex].is_cover_image = false;
      const newCoverImageIndex = findIndex(selectedImages, (image: IPropertySelectedImages) => {
        return selectedImage.attachment === image.attachment;
      });
      clonedSelectedImages[newCoverImageIndex].is_cover_image = true;
      this.setState({
        selectedImages: clonedSelectedImages,
      });
      return;
    }
    await AssetRepository.markAttachmentAsCoverImage(propertyId, selectedImage.id);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public postAttachmentsForProperty = async (): Promise<void> => {
    const { propertyId, onPressContinue } = this.props;
    const { selectedImages } = this.state;
    const attachmentIds: IPropertyImagesPostPayload[] = [];
    selectedImages.forEach((selectedImage: IPropertySelectedImages) =>
      attachmentIds.push({ attachment: selectedImage.attachment, is_cover_image: selectedImage.is_cover_image })
    );
    try {
      await AssetRepository.postAttachmentsForProperty(propertyId, attachmentIds);
      onPressContinue();
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

export default withTranslation()(PropertyImages);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    margin: 20,
  },
  uploadImageContainer: {
    flex: 1,
    marginVertical: 20,
    flexDirection: 'row',
  },
  uploadImageText: {
    color: theme.colors.darkTint4,
    flex: 1,
    justifyContent: 'flex-start',
  },
  thumbnailContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
  imageWrapper: {
    height: 100,
  },
  scrollView: {
    flex: 1,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  bottomSheetContainer: {
    margin: theme.layout.screenPadding,
  },
  imageContainer: {
    backgroundColor: theme.colors.white,
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    padding: 15,
    backgroundColor: theme.colors.moreSeparator,
  },
  headerText: {
    color: theme.colors.darkTint3,
  },
  videoContainer: {
    marginVertical: 20,
  },
});
