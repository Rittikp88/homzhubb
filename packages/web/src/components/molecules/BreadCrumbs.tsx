import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { routesConfig } from './NavigationInfo/constants';

// TODO : (bishal) add types here
// @ts-ignore
// eslint-disable-next-line react/prop-types,@typescript-eslint/explicit-function-return-type
const Breadcrumbs = ({ breadcrumbs }) => {
  const linkStyle = { textDecoration: 'none' };

  // @ts-ignore
  // eslint-disable-next-line react/prop-types
  const renderBreadcrum = ({ item: { breadcrumb, match }, index }) => (
    <View key={match.url} style={styles.breadCrumbs}>
      <Hoverable>
        {(isHovered: boolean): React.ReactNode => (
          <Link to={match.url || ''} style={linkStyle}>
            <Typography variant="label" size="regular" style={[styles.link, isHovered && styles.activeLink]}>
              {breadcrumb}
            </Typography>
          </Link>
        )}
      </Hoverable>
      {
        // eslint-disable-next-line react/prop-types
        index < breadcrumbs.length - 1 && (
          <Icon name={icons.rightArrow} color={theme.colors.white} style={styles.dividerIcon} />
        )
      }
    </View>
  );

  return (
    <View style={styles.breadCrumbsContainer}>
      {
        <FlatList
          data={breadcrumbs}
          renderItem={renderBreadcrum}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: theme.colors.white,
    textDecorationLine: 'none',
  },
  activeLink: {
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.white,
  },
  dividerIcon: {
    marginHorizontal: 8,
  },
  breadCrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  breadCrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default withBreadcrumbs(routesConfig)(Breadcrumbs);
