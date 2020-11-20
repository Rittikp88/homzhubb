import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  textData: string;
  badgeData: string;
  icon: string;
  iconSize?: number;
  badgeColor: string;
  textStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconWithBadge = (props: IProps): React.ReactElement => {
  const { containerStyle, textData, badgeData, icon, iconStyle = {}, badgeColor } = props;
  const { t } = useTranslation();
  return (
    <View style={containerStyle}>
      <View style={styles.child}>
        <Icon name={icon} size={20} style={iconStyle} />

        <Badge title={badgeData} badgeColor={badgeColor} badgeStyle={styles.badge} />
      </View>
      <View>
        <Text type="small" textType="regular" minimumFontScale={0.5} style={styles.textStyle}>
          {t(textData)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  child: { flexDirection: 'row' },
  badge: {
    marginBottom: 11,
    borderRadius: 50,
    marginLeft: -7,
    marginTop: -7,
  },
  textStyle: {
    fontSize: 14,
    color: theme.colors.darkTint3,
  },
});
export default IconWithBadge;
