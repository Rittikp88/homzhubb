import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import GroupChatAvatar from '@homzhub/common/src/components/atoms/GroupChatAvatar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { FullScreenAssetDetailsCarousel } from '@homzhub/mobile/src/components/molecules/FullScreenAssetDetailsCarousel';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { Links } from '@homzhub/common/src/domain/models/Links';
import { User } from '@homzhub/common/src/domain/models/User';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.GroupChatInfo>;

const LOAD_MORE = 'loadMore';

const GroupChatInfo = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { groupId },
    },
  } = props;
  const { t } = useTranslation();

  // LOCAL STATE
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [terminate, setTerminate] = useState<boolean>(false);

  const [zoomedImage, setZoomedImage] = useState<number>(0);
  const [hasClickedImage, setHasClickedImage] = useState<boolean>(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);
  const [openUser, setOpenUser] = useState<Partial<User>>({});

  const [usersData, setUsersData] = useState<GroupMessage>(new GroupMessage());
  const [media, setMedia] = useState<Attachment[]>([]);
  const [count, setCount] = useState<number>(10);
  const [links, setLinks] = useState<Links>(new Links());

  const { users, name } = usersData;

  const toggleProfileSheet = (): void => setIsBottomSheetVisible(!isBottomSheetVisible);

  const onFullScreenToggle = (): void => setHasClickedImage(!hasClickedImage);

  const updateSlide = (slideNumber: number): void => {
    setZoomedImage(slideNumber);
    setHasClickedImage(true);
  };

  const SectionSeparator = ({ extraStyle }: { extraStyle?: ViewStyle }): React.ReactElement => (
    <Divider containerStyles={[styles.divider, extraStyle]} />
  );

  const fetchGroupChatInfo = async (): Promise<void> => {
    setLoading(true);
    const membersData = await MessageRepository.getGroupChatInfo({ groupId });
    setUsersData(membersData);
    setLoading(false);
  };

  const fetchMedia = async (from?: string, link?: Links): Promise<void> => {
    if (from === LOAD_MORE) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    const { results, links } = await MessageRepository.getGroupChatMedia({ groupId, cursor: link?.next, count });
    const mediaData = from === LOAD_MORE ? [...media, ...results] : results;
    setMedia(mediaData);
    setLinks(links);
    setTerminate(links.next ? false : true);
    setCount(count);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    try {
      Promise.all([fetchGroupChatInfo(), fetchMedia()]);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const crossIcon = <Icon name={icons.close} size={20} onPress={navigation.goBack} color={theme.colors.darkTint6} />;

  const HeaderSection = useMemo(
    () => (): React.ReactElement => (
      <>
        <GroupChatAvatar containerStyle={styles.groupChatAvatar} faces={users} isHeader />
        <View style={styles.titleContainer}>
          <Text type="small" textType="semiBold" style={styles.propertyName}>
            {name}
          </Text>
          <Text type="small" textType="regular" style={styles.memberCount}>
            {t('common:chatMemberCount', { count: users.length })}
          </Text>
        </View>
        <SectionSeparator extraStyle={styles.headerSeparator} />
      </>
    ),
    [usersData]
  );

  const ProfileBottomSheet = useMemo(
    () => (): React.ReactElement => {
      const { fullName, profilePicture } = openUser;
      return (
        <>
          <BottomSheet
            visible={isBottomSheetVisible}
            sheetHeight={theme.viewport.height / 3}
            onCloseSheet={toggleProfileSheet}
            headerTitle={t('assetMore:profile')}
          >
            <View style={styles.profileSheet}>
              <Avatar isOnlyAvatar fullName={fullName} imageSize={72} image={profilePicture} />
              <Text textType="semiBold" type="small" style={styles.profileFullName}>
                {fullName}
              </Text>
            </View>
          </BottomSheet>
        </>
      );
    },
    [openUser]
  );

  const MembersSection = useMemo(
    () => (): React.ReactElement => {
      const renderItem: ListRenderItem<Partial<User>> = ({ item }) => {
        const { fullName, profilePicture, isAssetOwner } = item;
        const role = isAssetOwner ? t('property:owner') : t('property:tenant');
        const showProfile = () => {
          setOpenUser(item);
          toggleProfileSheet();
        };
        return (
          <>
            <View style={styles.chatItemContainer}>
              <TouchableOpacity style={styles.chatAvatarContainer} onPress={showProfile}>
                <Avatar isOnlyAvatar image={profilePicture} imageSize={42} fullName={fullName} />
              </TouchableOpacity>

              <View style={styles.chatItemTextContainer}>
                <Text textType="semiBold" type="small">
                  {fullName}
                </Text>
                <Text textType="light" type="small" style={styles.role}>
                  {role}
                </Text>
              </View>
            </View>
          </>
        );
      };

      const keyExtractor = (item: User, index: number): string => `${item.id}[${index}]`;

      const renderDivider = (): React.ReactElement => (
        <Divider containerStyles={[styles.divider, styles.darkDivider]} />
      );

      return (
        <View style={styles.sectionView}>
          <Text type="small" textType="semiBold">
            {t('common:members')}
          </Text>
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={renderDivider}
            contentContainerStyle={styles.listView}
          />
        </View>
      );
    },
    [usersData]
  );

  const handleLoadMore = (): void => {
    if (!terminate && !loading && !loadingMore) {
      fetchMedia(LOAD_MORE, links);
    }
  };

  const MediaSection = (): React.ReactElement => {
    const keyExtractor = (item: Attachment, index: number): string => `${item.id}[${index}]`;

    const renderItem: ListRenderItem<Attachment> = ({ item }) => {
      const { id, link } = item;
      const setActiveImage = () => updateSlide(media.indexOf(item));
      return (
        <TouchableOpacity key={id} style={styles.mediaHolder} onPress={setActiveImage}>
          <Image source={{ uri: link }} style={styles.image} resizeMode="stretch" />
        </TouchableOpacity>
      );
    };

    const mediaSeparator = () => <View style={styles.mediaSeparator} />;

    const onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }): void => {
      if (distanceFromEnd >= 0) {
        handleLoadMore();
      }
    };

    const RenderFooter = (): React.ReactElement | null => {
      if (loadingMore)
        return (
          <View style={styles.loadMore}>
            <ActivityIndicator size="large" />
          </View>
        );
      return null;
    };

    return (
      <>
        <SectionSeparator extraStyle={styles.mediaSectionStarter} />
        <Text type="small" textType="semiBold" style={styles.mediaHeader}>
          {t('common:media')}
        </Text>

        <FlatList
          data={media}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          ItemSeparatorComponent={mediaSeparator}
          onEndReachedThreshold={0.01}
          onEndReached={onEndReached}
          ListFooterComponent={RenderFooter}
        />
      </>
    );
  };

  const FullScreenImage = (): React.ReactElement => (
    <>
      {hasClickedImage && media && (
        <FullScreenAssetDetailsCarousel
          activeSlide={zoomedImage}
          data={media}
          onFullScreenToggle={onFullScreenToggle}
          updateSlide={updateSlide}
          hasOnlyImages
        />
      )}
    </>
  );

  return (
    <>
      <UserScreen
        title={t('assetMore:more')}
        pageTitle={t('assetMore:profileDetails')}
        loading={loading && !loadingMore}
        rightNode={crossIcon}
        hasLeftIcon={false}
        scrollEnabled
      >
        <HeaderSection />
        <MembersSection />
        {Boolean(media.length) && <MediaSection />}
      </UserScreen>
      <ProfileBottomSheet />
      <FullScreenImage />
    </>
  );
};

export default React.memo(GroupChatInfo);

const styles = StyleSheet.create({
  groupChatAvatar: {
    marginTop: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyName: {
    marginTop: 15,
  },
  memberCount: {
    marginTop: 8,
    fontSize: 14,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    marginVertical: 15,
  },
  chatItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  chatAvatarContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  chatItemTextContainer: {
    flex: 5,
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },
  darkDivider: {
    borderColor: theme.colors.background,
  },
  sectionView: {
    marginHorizontal: 16,
  },
  listView: {
    marginTop: 16,
  },
  mediaHolder: {
    marginStart: 16,
  },
  image: {
    width: theme.viewport.width / 2 - 40,
    height: 100,
    borderRadius: 4,
  },
  mediaSectionStarter: {
    marginVertical: 0,
    marginTop: 24,
  },
  mediaSeparator: {
    marginVertical: 8,
  },
  headerSeparator: {
    marginVertical: 24,
  },
  mediaHeader: {
    margin: 16,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
  loadMore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileFullName: {
    marginVertical: 20,
  },
});
