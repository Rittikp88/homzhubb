/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import DetailsTab from '@homzhub/web/src/screens/propertyDetailOwner/Components/DetailsTab';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IRoutes, Tabs, PropertyDetailOwner } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  assetDetails: Asset;
  propertyTermId: number;
}

const TabSections = (propsData: IProps): React.ReactElement => {
  const [currentIndex, setcurrentIndex] = useState(0);
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const {
    assetDetails: { description, features, leaseTerm, saleTerm, amenityGroup, highlights },
  } = propsData;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const renderTabScene = (route: IRoutes): React.ReactElement | null => {
    switch (route.key) {
      case Tabs.DETAILS:
        return (
          <DetailsTab
            description={description}
            features={features}
            leaseTerm={leaseTerm}
            saleTerm={saleTerm}
            amenityGroup={amenityGroup}
            assetHighlights={highlights}
          />
        );
      default:
        return (
          <View style={styles.comingSoonContent}>
            <Text type="large">{t('comingSoonText')}</Text>
          </View>
        );
    }
  };

  const handleIndexChange = (index: number): void => {
    setcurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <TabView
        lazy
        swipeEnabled={false}
        renderScene={({ route }): React.ReactElement | null => renderTabScene(route)}
        onIndexChange={handleIndexChange}
        renderTabBar={(props): React.ReactElement => {
          const {
            // eslint-disable-next-line no-unused-vars
            // eslint-disable-next-line react/prop-types
            navigationState: { index, routes },
          } = props;
          const currentRoute = routes[index];
          return (
            <TabBar
              {...props}
              scrollEnabled
              style={styles.backgroundWhite}
              indicatorStyle={styles.backgroundBlue}
              tabStyle={[styles.tabBarWidth, isMobile && styles.tabBarMobile]}
              renderIcon={({ route }): React.ReactElement => {
                const isSelected = currentRoute.key === route.key;
                return (
                  <Icon name={route.icon} color={isSelected ? theme.colors.blue : theme.colors.darkTint3} size={22} />
                );
              }}
              renderLabel={({ route }): React.ReactElement => {
                const isSelected = currentRoute.key === route.key;
                return (
                  <Text
                    type="small"
                    style={[
                      styles.label,
                      isSelected && {
                        color: theme.colors.blue,
                      },
                    ]}
                  >
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        navigationState={{
          index: currentIndex,
          routes: PropertyDetailOwner,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  label: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  tabBarWidth: {
    width: 140,
  },
  tabBarMobile: {
    width: 100,
  },
  backgroundBlue: {
    backgroundColor: theme.colors.blue,
  },
  backgroundWhite: {
    backgroundColor: theme.colors.white,
  },
  comingSoonContent: {
    alignItems: 'center',
    minHeight: 350,
    height: 'auto',
    paddingVertical: 150,
    backgroundColor: theme.colors.white,
    marginBottom: 24,
  },
});

export default TabSections;
