import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import OfferCompareTable from '@homzhub/mobile/src/components/organisms/OfferCompareTable';
import OfferProspectTable from '@homzhub/mobile/src/components/organisms/OfferProspectTable';

interface IProps {
  selectedIds: number[];
  isLeaseFlow?: boolean;
}

const CompareOfferView = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { selectedIds, isLeaseFlow = true } = props;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'offer', title: t('offers:compareOffer') },
    { key: 'prospect', title: t('offers:compareProspect') },
  ]);

  const renderTabView = (): React.ReactElement => {
    const renderScene = SceneMap({
      offer: renderOffer,
      prospect: renderProspect,
    });

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: theme.viewport.width }}
        renderTabBar={(barProps): React.ReactElement => {
          const {
            navigationState: { index: stateIndex, routes: barRoutes },
          } = barProps;
          const currentRoute = barRoutes[stateIndex];

          return (
            <TabBar
              {...barProps}
              style={{ backgroundColor: theme.colors.white }}
              indicatorStyle={{ backgroundColor: theme.colors.blue }}
              renderLabel={({ route }): React.ReactElement => {
                const isSelected = currentRoute.key === route.key;
                return (
                  <Text
                    type="small"
                    style={[
                      { color: theme.colors.darkTint3 },
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
      />
    );
  };

  const renderOffer = (): React.ReactElement => <OfferCompareTable selectedOfferIds={selectedIds} />;
  const renderProspect = (): React.ReactElement => <OfferProspectTable selectedOfferIds={selectedIds} />;

  return <>{isLeaseFlow ? renderTabView() : <OfferCompareTable selectedOfferIds={selectedIds} />}</>;
};

export default CompareOfferView;
