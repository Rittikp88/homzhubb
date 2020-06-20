import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { findIndex } from 'lodash';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { IPropertySelectedImages } from '@homzhub/common/src/domain/models/Service';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, ImageThumbnail, Text, UploadBox, WithShadowView } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';

interface IProps {
  propertyId: number;
  updateStep: () => void;
}

type OwnProps = WithTranslation;
type Props = OwnProps & IProps;

interface IPropertyImagesState {
  selectedImages: IPropertySelectedImages[];
  isBottomSheetVisible: boolean;
}

class PropertyImages extends React.PureComponent<Props, IPropertyImagesState> {
  public state = {
    selectedImages: [],
    isBottomSheetVisible: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { selectedImages, isBottomSheetVisible } = this.state;
    const header = selectedImages.length > 0 ? t('property:addMore') : t('property:addPhotos');
    return (
      <View style={styles.container}>
        <UploadBox
          icon={icons.gallery}
          header={header}
          subHeader={t('property:supportedImageFormats')}
          onPress={this.onPhotosUpload}
          containerStyle={styles.uploadBox}
        />
        <View style={styles.imagesContainer}>{this.renderImages()}</View>
        <BottomSheet
          isShadowView
          sheetHeight={750}
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
      </View>
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
          <Text type="regular" textType="semiBold" style={styles.uploadImageText}>
            {t('property:uploadedImages')}
          </Text>
          <Text type="regular" textType="semiBold" style={styles.edit} onPress={this.onToggleBottomSheet}>
            {t('common:edit')}
          </Text>
        </View>
        <View>{this.renderImageThumbnails()}</View>
      </>
    );
  };

  public renderImageThumbnails = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedImages } = this.state;
    const coverPhoto: React.ReactNode[] = [];
    if (selectedImages.length > 0) {
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
    }
    return (
      <>
        {coverPhoto}
        <SafeAreaView>
          <FlatList
            data={selectedImages.slice(1, 7)}
            numColumns={3}
            renderItem={this.renderImagesList}
            keyExtractor={this.renderKeyExtractor}
          />
        </SafeAreaView>
      </>
    );
  };

  private renderImagesList = (data: { item: IPropertySelectedImages; index: number }): React.ReactElement => {
    const { item, index } = data;
    const { selectedImages } = this.state;
    const extraDataLength = selectedImages.length > 6 ? selectedImages.length - 7 : selectedImages.length;
    const isLastThumbnail = index === 5;
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
    return selectedImages.map((currentImage: IPropertySelectedImages, index: number) => {
      const deletePropertyImage = async (): Promise<void> => await this.deletePropertyImage(currentImage);
      const markFavorite = async (): Promise<void> => await this.markAttachmentAsCoverImage(currentImage);
      return (
        <ImageThumbnail
          imageUrl={currentImage.link}
          key={index}
          coverPhotoTitle={t('property:addCoverPhoto')}
          isCoverPhotoContainer
          isIconVisible
          isFavorite={currentImage.is_cover_image}
          markFavorite={markFavorite}
          containerStyle={{ margin: theme.layout.screenPadding }}
          onIconPress={deletePropertyImage}
        />
      );
    });
  };

  private renderKeyExtractor = (item: IPropertySelectedImages, index: number): string => {
    const { id } = item;
    return `${id}-${index}`;
  };

  public onPhotosUpload = async (): Promise<void> => {
    const { propertyId } = this.props;
    const { Blob } = RNFetchBlob.polyfill;
    const { fs } = RNFetchBlob;
    // @ts-ignore
    const images: ImagePickerResponse[] = await ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 1,
      includeBase64: true,
      mediaType: 'photo',
    });
    images.forEach((image: ImagePickerResponse) => {
      const imagePath = image.path;
      const { mime } = image;
      fs.readFile(imagePath, 'base64')
        .then((data) => {
          // @ts-ignore
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(async (blob) => {
          const formData = new FormData();
          const file = new File([blob], 'someName.jpg', { type: image.mime });
          formData.append('files[]', file);
          await ServiceRepository.postAttachment(formData);
          await this.getPropertyImagesByPropertyId(propertyId);
          return blob;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // this.setState({
    //   selectedImages: images.map((image: any) => {
    //     return { uri: image.path, width: image.width, height: image.height, mime: image.mime, data: image.data };
    //   }),
    // });
    // images.forEach((image: any) => {
    //   const file = {
    //     ...image,
    //     uri: image.uri,
    //     name: PlatformUtils.isIOS() ? image.filename : `asset_images_${Date.now()}.${image.mime.split('/')[1]}`,
    //   };
    //   formData.append('files[]', JSON.stringify(file));
    // });
    // await ServiceRepository.postAttachment(formData);
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
    await ServiceRepository.deletePropertyImage(propertyId, selectedImage.attachment);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<void> => {
    const response = await ServiceRepository.getPropertyImagesByPropertyId(propertyId);
    this.setState({
      selectedImages: response,
    });
  };

  public markAttachmentAsCoverImage = async (selectedImage: IPropertySelectedImages): Promise<void> => {
    const { propertyId } = this.props;
    await ServiceRepository.markAttachmentAsCoverImage(propertyId, selectedImage.attachment);
    await this.getPropertyImagesByPropertyId(propertyId);
  };

  public postAttachmentsForProperty = async (): Promise<void> => {
    const { propertyId, updateStep } = this.props;
    const { selectedImages } = this.state;
    const attachmentIds: number[] = [];
    selectedImages.forEach((selectedImage: IPropertySelectedImages) => attachmentIds.push(selectedImage.attachment));
    await ServiceRepository.postAttachmentsForProperty(propertyId, { id: attachmentIds });
    updateStep();
  };
}

export default withTranslation()(PropertyImages);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  uploadBox: {
    marginTop: 20,
  },
  edit: {
    color: theme.colors.blue,
  },
  imagesContainer: {
    flex: 1,
    marginTop: 20,
  },
  uploadImageContainer: {
    flex: 1,
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
    marginBottom: 100,
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
});
